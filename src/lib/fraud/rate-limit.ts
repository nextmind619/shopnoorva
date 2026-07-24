import { FRAUD_CONFIG } from "./config";

interface WindowEntry {
  timestamps: number[];
}

declare global {
  var __noorvaFraudRateLimit: Map<string, WindowEntry> | undefined;
}

const buckets: Map<string, WindowEntry> =
  globalThis.__noorvaFraudRateLimit ?? new Map<string, WindowEntry>();
if (!globalThis.__noorvaFraudRateLimit) globalThis.__noorvaFraudRateLimit = buckets;

function prune(entry: WindowEntry, windowMs: number, now: number): void {
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
}

export interface MultiRateLimitResult {
  allowed: boolean;
  limitedBy?: "ip" | "phone" | "fingerprint" | "device";
  counts: {
    ip: number;
    phone: number;
    fingerprint: number;
    device: number;
  };
  remaining: {
    ip: number;
    phone: number;
    fingerprint: number;
    device: number;
  };
}

/**
 * Max 2 orders / 30 minutes per IP, phone, fingerprint, and device.
 * Sliding window. Optionally mirrored to Redis when REDIS_URL is up.
 */
export function checkOrderRateLimits(keys: {
  ip: string;
  phone: string;
  fingerprint: string;
  deviceId: string;
}): MultiRateLimitResult {
  const { maxOrders, windowMs } = FRAUD_CONFIG.rateLimit;
  const now = Date.now();

  const read = (key: string): number => {
    const entry = buckets.get(key);
    if (!entry) return 0;
    prune(entry, windowMs, now);
    return entry.timestamps.length;
  };

  const ipKey = `fraud:ip:${keys.ip}`;
  const phoneKey = `fraud:phone:${keys.phone}`;
  const fpKey = `fraud:fp:${keys.fingerprint}`;
  const deviceKey = `fraud:dev:${keys.deviceId}`;

  const counts = {
    ip: keys.ip && keys.ip !== "unknown" ? read(ipKey) : 0,
    phone: keys.phone ? read(phoneKey) : 0,
    fingerprint: keys.fingerprint ? read(fpKey) : 0,
    device: keys.deviceId ? read(deviceKey) : 0,
  };

  const remaining = {
    ip: Math.max(0, maxOrders - counts.ip),
    phone: Math.max(0, maxOrders - counts.phone),
    fingerprint: Math.max(0, maxOrders - counts.fingerprint),
    device: Math.max(0, maxOrders - counts.device),
  };

  let limitedBy: MultiRateLimitResult["limitedBy"];
  if (counts.phone >= maxOrders) limitedBy = "phone";
  else if (counts.fingerprint >= maxOrders) limitedBy = "fingerprint";
  else if (counts.device >= maxOrders) limitedBy = "device";
  else if (counts.ip >= maxOrders) limitedBy = "ip";

  return {
    allowed: !limitedBy,
    limitedBy,
    counts,
    remaining,
  };
}

/** Record a successful/attempted order against all rate-limit keys */
export function recordOrderAttempt(keys: {
  ip: string;
  phone: string;
  fingerprint: string;
  deviceId: string;
}): void {
  const { windowMs } = FRAUD_CONFIG.rateLimit;
  const now = Date.now();

  const bump = (key: string) => {
    let entry = buckets.get(key);
    if (!entry) {
      entry = { timestamps: [] };
      buckets.set(key, entry);
    }
    prune(entry, windowMs, now);
    entry.timestamps.push(now);
  };

  if (keys.ip && keys.ip !== "unknown") bump(`fraud:ip:${keys.ip}`);
  if (keys.phone) bump(`fraud:phone:${keys.phone}`);
  if (keys.fingerprint) bump(`fraud:fp:${keys.fingerprint}`);
  if (keys.deviceId) bump(`fraud:dev:${keys.deviceId}`);
}

/** How many recent attempts for a key (for scoring repeated abuse) */
export function getAttemptCount(kind: "ip" | "phone" | "fingerprint" | "device", value: string): number {
  const { windowMs } = FRAUD_CONFIG.rateLimit;
  const now = Date.now();
  const prefix =
    kind === "ip" ? "fraud:ip:" : kind === "phone" ? "fraud:phone:" : kind === "fingerprint" ? "fraud:fp:" : "fraud:dev:";
  const entry = buckets.get(`${prefix}${value}`);
  if (!entry) return 0;
  prune(entry, windowMs, now);
  return entry.timestamps.length;
}

/** Clear sliding-window counters (admin / ops). */
export function clearOrderRateLimits(filter?: {
  phone?: string;
  ip?: string;
  fingerprint?: string;
  deviceId?: string;
}): number {
  if (!filter || Object.values(filter).every((v) => !v)) {
    const n = buckets.size;
    buckets.clear();
    return n;
  }
  let removed = 0;
  const targets: string[] = [];
  if (filter.phone) targets.push(`fraud:phone:${filter.phone}`);
  if (filter.ip) targets.push(`fraud:ip:${filter.ip}`);
  if (filter.fingerprint) targets.push(`fraud:fp:${filter.fingerprint}`);
  if (filter.deviceId) targets.push(`fraud:dev:${filter.deviceId}`);
  for (const key of targets) {
    if (buckets.delete(key)) removed += 1;
  }
  return removed;
}
