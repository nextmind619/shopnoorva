/**
 * Owner IP allowlist (env SECURITY_ALLOW_IPS).
 * Exact IPs and IPv4 CIDRs. Never read secrets from the request.
 */

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let value = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const octet = Number(part);
    if (octet > 255) return null;
    value = value * 256 + octet;
  }
  return value;
}

function ipv4InCidr(ip: string, cidr: string): boolean {
  const slash = cidr.indexOf("/");
  if (slash <= 0) return false;
  const base = cidr.slice(0, slash);
  const bits = Number(cidr.slice(slash + 1));
  if (!Number.isInteger(bits) || bits < 0 || bits > 32) return false;
  const ipInt = ipv4ToInt(ip);
  const baseInt = ipv4ToInt(base);
  if (ipInt == null || baseInt == null) return false;
  if (bits === 0) return true;
  const mask = (0xffffffff << (32 - bits)) >>> 0;
  return (ipInt & mask) === (baseInt & mask);
}

export function parseAllowlist(raw: string | undefined | null): string[] {
  return (raw || "")
    .split(/[,;\s]+/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

/** True when `ip` is listed in SECURITY_ALLOW_IPS (exact or IPv4 CIDR). */
export function isAllowlistedIp(ip: string, raw = process.env.SECURITY_ALLOW_IPS): boolean {
  const value = (ip || "").trim().toLowerCase();
  if (!value || value === "unknown") return false;
  const entries = parseAllowlist(raw);
  return entries.some((entry) => {
    if (entry.includes("/")) return ipv4InCidr(value, entry);
    return entry === value;
  });
}

/** Owner preview token or allowlisted IP always gets the storefront. */
export function applyOwnerBypass<T extends string>(decision: T, bypass: boolean): T | "allow" {
  if (bypass && decision !== "allow") return "allow";
  return decision;
}
