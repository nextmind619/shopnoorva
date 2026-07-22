/**
 * Production JS hardening helpers.
 * Next.js already minifies client bundles; source maps are disabled in next.config.
 * This module centralizes opaque cookie/header names to avoid leaking intent in strings.
 */

export const NV = {
  trust: "nv_vt",
  needChallenge: "nv_need_ch",
  challenge: "nv_ch",
} as const;

/** Light string scramble for client-visible markers (not cryptographic) */
export function scramble(input: string): string {
  return Buffer.from(input, "utf8").toString("base64").replace(/=+$/, "");
}
