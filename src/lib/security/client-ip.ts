/**
 * Visitor IP extraction that skips Cloudflare / private proxy hops.
 * EasyPanel + Cloudflare often put a CF edge address in X-Forwarded-For;
 * scoring that as a datacenter IP hard-blocks real Moroccan shoppers.
 */

const PRIVATE_RE =
  /^(?:10\.|127\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.|::1|fc|fd|fe80:|localhost)/i;

/** Cloudflare anycast / WARP edges — proxy hops, not the shopper. */
const CLOUDFLARE_V4_PREFIXES = [
  "104.16.",
  "104.17.",
  "104.18.",
  "104.19.",
  "104.20.",
  "104.21.",
  "104.22.",
  "104.23.",
  "104.24.",
  "104.25.",
  "104.26.",
  "104.27.",
  "108.162.",
  "141.101.",
  "162.158.",
  "172.64.",
  "172.65.",
  "172.66.",
  "172.67.",
  "173.245.",
  "188.114.",
  "190.93.",
  "197.234.",
  "198.41.",
];

const CLOUDFLARE_V6_PREFIXES = [
  "2400:cb00:",
  "2606:4700:",
  "2803:f800:",
  "2405:b500:",
  "2405:8100:",
  "2a06:98c0:",
  "2c0f:f248:",
];

export function isPrivateOrLocalIp(ip: string): boolean {
  const value = (ip || "").trim();
  return !value || value === "unknown" || PRIVATE_RE.test(value);
}

export function isCloudflareHopIp(ip: string): boolean {
  const value = (ip || "").trim().toLowerCase();
  if (!value) return false;
  if (CLOUDFLARE_V4_PREFIXES.some((p) => value.startsWith(p))) return true;
  return CLOUDFLARE_V6_PREFIXES.some((p) => value.startsWith(p));
}

function isUsableClientIp(ip: string): boolean {
  const value = (ip || "").trim();
  if (!value || value === "unknown") return false;
  if (isPrivateOrLocalIp(value)) return false;
  if (isCloudflareHopIp(value)) return false;
  return true;
}

function headerValues(headers: Headers, name: string): string[] {
  return (headers.get(name) || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * Prefer the real visitor IP over reverse-proxy / Cloudflare edges.
 */
export function extractClientIp(headers: Headers): string {
  const candidates = [
    ...headerValues(headers, "cf-connecting-ip"),
    ...headerValues(headers, "true-client-ip"),
    ...headerValues(headers, "x-real-ip"),
    ...headerValues(headers, "x-forwarded-for"),
    ...headerValues(headers, "x-client-ip"),
  ];

  for (const ip of candidates) {
    if (isUsableClientIp(ip)) return ip;
  }

  for (const ip of candidates) {
    if (ip && ip !== "unknown" && !isPrivateOrLocalIp(ip)) return ip;
  }

  return candidates[0] || "unknown";
}
