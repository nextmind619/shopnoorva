import { createHash } from "crypto";
import type { DeviceSignals } from "./types";

/**
 * Build a stable browser fingerprint from client signals + server hints.
 * Server never trusts client fingerprint alone — we re-hash with IP class.
 */
export function buildFingerprint(
  device: DeviceSignals | undefined,
  ip: string,
  userAgent?: string
): string {
  const parts = [
    device?.canvasFingerprint || "",
    device?.webglFingerprint || "",
    device?.platform || "",
    device?.screenResolution || `${device?.screenWidth || 0}x${device?.screenHeight || 0}`,
    device?.timezone || "",
    device?.language || "",
    String(device?.colorDepth || ""),
    String(device?.hardwareConcurrency || ""),
    String(device?.maxTouchPoints ?? ""),
    userAgent || device?.userAgent || "",
    ipBucket(ip),
  ];

  const clientFp = (device?.fingerprint || "").trim();
  const raw = `${parts.join("|")}#${clientFp}`;
  return createHash("sha256").update(raw).digest("hex").slice(0, 32);
}

/** Soft IP bucket so residential DHCP churn doesn't explode identities */
export function ipBucket(ip: string): string {
  if (!ip || ip === "unknown") return "unknown";
  // IPv4 /24
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
    const parts = ip.split(".");
    return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
  }
  // IPv6 — first 4 hextets
  if (ip.includes(":")) {
    const hextets = ip.split(":").filter(Boolean).slice(0, 4);
    return `${hextets.join(":")}::/64`;
  }
  return ip;
}

export function resolveDeviceId(device: DeviceSignals | undefined, fingerprint: string): string {
  const id = (device?.deviceId || "").trim();
  if (id && /^[a-zA-Z0-9_-]{8,64}$/.test(id)) return id;
  return `dev_${fingerprint.slice(0, 16)}`;
}

export function hashValue(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}
