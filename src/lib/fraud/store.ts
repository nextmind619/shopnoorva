import { FRAUD_CONFIG } from "./config";
import type { BlacklistEntry, BlacklistType, FraudDashboardStats, FraudDecision, FraudLogEntry } from "./types";
import type { AttemptRecord } from "./velocity";
import { normalizeAddressKey } from "./velocity-utils";
import { uid } from "@/lib/ai/memory-store";
import { persistBlacklistEntry, persistFraudLog } from "./persist-db";

class FraudStore {
  blacklist: BlacklistEntry[] = [];
  logs: FraudLogEntry[] = [];
  attempts: AttemptRecord[] = [];
}

declare global {
  var __noorvaFraudStore: FraudStore | undefined;
}

export const fraudStore: FraudStore =
  globalThis.__noorvaFraudStore ?? new FraudStore();
if (!globalThis.__noorvaFraudStore) globalThis.__noorvaFraudStore = fraudStore;

function findBlacklist(type: BlacklistType, value: string): BlacklistEntry | undefined {
  const v = value.trim().toLowerCase();
  return fraudStore.blacklist.find((b) => b.type === type && b.value === v);
}

export function isBlacklisted(
  checks: Partial<Record<BlacklistType, string>>
): { blocked: boolean; entry?: BlacklistEntry } {
  for (const type of ["phone", "ip", "fingerprint", "device"] as BlacklistType[]) {
    const value = checks[type];
    if (!value || value === "unknown") continue;
    const entry = findBlacklist(type, value);
    if (entry) {
      entry.hits += 1;
      entry.lastHitAt = new Date().toISOString();
      return { blocked: true, entry };
    }
  }
  return { blocked: false };
}

export function addToBlacklist(input: {
  type: BlacklistType;
  value: string;
  reason: string;
  source?: "auto" | "manual";
}): BlacklistEntry {
  const value = input.value.trim().toLowerCase();
  const existing = findBlacklist(input.type, value);
  if (existing) {
    existing.reason = input.reason;
    existing.hits += 1;
    existing.lastHitAt = new Date().toISOString();
    return existing;
  }
  const entry: BlacklistEntry = {
    id: uid("bl"),
    type: input.type,
    value,
    reason: input.reason,
    createdAt: new Date().toISOString(),
    source: input.source || "auto",
    hits: 0,
  };
  fraudStore.blacklist.push(entry);
  void persistBlacklistEntry(entry).catch(() => {
    /* memory store remains authoritative */
  });
  return entry;
}

export function removeFromBlacklist(id: string): boolean {
  const idx = fraudStore.blacklist.findIndex((b) => b.id === id);
  if (idx < 0) return false;
  fraudStore.blacklist.splice(idx, 1);
  return true;
}

export function autoBlacklistOnReject(input: {
  decision: FraudDecision;
  reasons: string[];
  phone: string;
  ip: string;
  fingerprint: string;
  deviceId: string;
}): void {
  if (input.decision !== "reject") return;

  // Never permanently ban on honeypot alone (common Chrome autofill false positive).
  const nonHoneypotReasons = input.reasons.filter((r) => r !== "honeypot" && !r.startsWith("honeypot"));
  if (nonHoneypotReasons.length === 0) return;

  const should =
    nonHoneypotReasons.some((r) =>
      (FRAUD_CONFIG.blacklist.autoReasons as readonly string[]).some((a) => r.includes(a))
    ) ||
    nonHoneypotReasons.some(
      (r) =>
        r.includes("automation") ||
        r.includes("headless") ||
        r.includes("webdriver") ||
        r.includes("fake_phone") ||
        r.includes("tor")
    );

  if (!should) return;

  const reason = input.reasons.slice(0, 3).join(", ") || "auto_reject";
  if (input.phone) addToBlacklist({ type: "phone", value: input.phone, reason });
  if (input.ip && input.ip !== "unknown") addToBlacklist({ type: "ip", value: input.ip, reason });
  if (input.fingerprint) addToBlacklist({ type: "fingerprint", value: input.fingerprint, reason });
  if (input.deviceId) addToBlacklist({ type: "device", value: input.deviceId, reason });
}

export function pushFraudLog(entry: FraudLogEntry): void {
  fraudStore.logs.unshift(entry);
  if (fraudStore.logs.length > FRAUD_CONFIG.maxLogs) {
    fraudStore.logs.length = FRAUD_CONFIG.maxLogs;
  }
  void persistFraudLog(entry).catch(() => {
    /* memory store remains authoritative */
  });
}

export function recordAttempt(input: {
  phone: string;
  fullName: string;
  address: string;
  ip: string;
  fingerprint: string;
  deviceId: string;
  decision: string;
}): void {
  fraudStore.attempts.unshift({
    id: uid("att"),
    createdAt: Date.now(),
    phone: input.phone,
    fullName: input.fullName,
    address: input.address,
    addressKey: normalizeAddressKey(input.address),
    ip: input.ip,
    fingerprint: input.fingerprint,
    deviceId: input.deviceId,
    decision: input.decision,
  });
  if (fraudStore.attempts.length > FRAUD_CONFIG.maxAttempts) {
    fraudStore.attempts.length = FRAUD_CONFIG.maxAttempts;
  }
}

export function getAttempts(): AttemptRecord[] {
  return fraudStore.attempts;
}

export function getFraudLogs(limit = 100): FraudLogEntry[] {
  return fraudStore.logs.slice(0, limit);
}

export function getBlacklist(type?: BlacklistType): BlacklistEntry[] {
  if (!type) return [...fraudStore.blacklist];
  return fraudStore.blacklist.filter((b) => b.type === type);
}

export function getFraudDashboardStats(): FraudDashboardStats {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const todayIso = startOfDay.toISOString();
  const todayLogs = fraudStore.logs.filter((l) => l.createdAt >= todayIso);

  const rejected = todayLogs.filter((l) => l.decision === "reject");
  const accepted = todayLogs.filter((l) => l.decision === "accept");
  const review = todayLogs.filter((l) => l.decision === "review");

  const avgScoreToday =
    todayLogs.length === 0
      ? 0
      : Math.round(todayLogs.reduce((s, l) => s + l.score, 0) / todayLogs.length);

  const avgDurationMs =
    todayLogs.length === 0
      ? 0
      : Math.round(todayLogs.reduce((s, l) => s + l.durationMs, 0) / todayLogs.length);

  return {
    todayFakeAttempts: rejected.length,
    blockedIps: fraudStore.blacklist.filter((b) => b.type === "ip").length,
    blockedPhones: fraudStore.blacklist.filter((b) => b.type === "phone").length,
    blockedFingerprints: fraudStore.blacklist.filter((b) => b.type === "fingerprint").length,
    blockedDevices: fraudStore.blacklist.filter((b) => b.type === "device").length,
    highRiskOrders: todayLogs.filter((l) => l.score < 50).length,
    acceptedOrders: accepted.length,
    rejectedOrders: rejected.length,
    reviewOrders: review.length,
    avgScoreToday,
    avgDurationMs,
  };
}
