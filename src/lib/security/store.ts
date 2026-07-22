import { uid } from "@/lib/ai/memory-store";
import { SECURITY_CONFIG } from "./config";
import type { SecurityBlacklistEntry, SecurityLogEntry, VisitorDecision } from "./types";

class SecurityStore {
  logs: SecurityLogEntry[] = [];
  blacklist: SecurityBlacklistEntry[] = [];
}

declare global {
  var __noorvaSecurityStore: SecurityStore | undefined;
}

export const securityStore: SecurityStore =
  globalThis.__noorvaSecurityStore ?? new SecurityStore();
if (!globalThis.__noorvaSecurityStore) globalThis.__noorvaSecurityStore = securityStore;

export function isSecurityBlacklisted(ip: string, ua?: string): SecurityBlacklistEntry | undefined {
  const ipHit = securityStore.blacklist.find(
    (b) => b.type === "ip" && b.value === ip.toLowerCase()
  );
  if (ipHit) {
    ipHit.hits += 1;
    return ipHit;
  }
  if (ua) {
    const uaHash = ua.slice(0, 120).toLowerCase();
    return securityStore.blacklist.find((b) => b.type === "ua" && b.value === uaHash);
  }
  return undefined;
}

export function addSecurityBlacklist(input: {
  type: "ip" | "fingerprint" | "ua";
  value: string;
  reason: string;
  source?: "auto" | "manual";
}): SecurityBlacklistEntry {
  const value = input.value.trim().toLowerCase();
  const existing = securityStore.blacklist.find((b) => b.type === input.type && b.value === value);
  if (existing) {
    existing.hits += 1;
    existing.reason = input.reason;
    return existing;
  }
  const entry: SecurityBlacklistEntry = {
    id: uid("sbl"),
    type: input.type,
    value,
    reason: input.reason,
    hits: 0,
    createdAt: new Date().toISOString(),
    source: input.source || "auto",
  };
  securityStore.blacklist.push(entry);
  return entry;
}

export function pushSecurityLog(entry: Omit<SecurityLogEntry, "id" | "createdAt"> & { id?: string }): void {
  securityStore.logs.unshift({
    id: entry.id || uid("slog"),
    createdAt: new Date().toISOString(),
    ip: entry.ip,
    userAgent: entry.userAgent,
    referer: entry.referer,
    pathname: entry.pathname,
    score: entry.score,
    decision: entry.decision,
    reasons: entry.reasons,
    flags: entry.flags,
    ipRisk: entry.ipRisk,
  });
  if (securityStore.logs.length > SECURITY_CONFIG.maxLogs) {
    securityStore.logs.length = SECURITY_CONFIG.maxLogs;
  }
}

export function getSecurityLogs(limit = 100): SecurityLogEntry[] {
  return securityStore.logs.slice(0, limit);
}

export function getSecurityBlacklist(): SecurityBlacklistEntry[] {
  return [...securityStore.blacklist];
}

export function getSecurityStats() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const iso = start.toISOString();
  const today = securityStore.logs.filter((l) => l.createdAt >= iso);
  const count = (d: VisitorDecision) => today.filter((l) => l.decision === d).length;
  return {
    blockedToday: count("block"),
    challengedToday: count("challenge"),
    allowedToday: count("allow"),
    blacklistSize: securityStore.blacklist.length,
    avgScoreToday:
      today.length === 0 ? 0 : Math.round(today.reduce((s, l) => s + l.score, 0) / today.length),
  };
}
