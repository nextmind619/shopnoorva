/**
 * Meta Conversions API customer-information hashing.
 * Spec: lowercase → trim → (phones: digits only E.164) → SHA-256 hex.
 * Do NOT hash: client_ip_address, client_user_agent, fbp, fbc.
 */

import { createHash } from "crypto";
import type { FacebookUserDataInput } from "./types";
import { FACEBOOK_DEFAULT_COUNTRY } from "./config";

export function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Normalize phone to digits suitable for Meta (prefer E.164 without '+').
 * Moroccan local `06…` / `07…` → `2126…` / `2127…`.
 */
export function normalizePhoneForMeta(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (!digits) return "";

  // Strip leading 00 international prefix
  if (digits.startsWith("00")) digits = digits.slice(2);

  // Local Moroccan mobiles → country code 212
  if (/^0[67]\d{8}$/.test(digits)) {
    digits = `212${digits.slice(1)}`;
  }

  return digits;
}

function normalizeCountry(value: string): string {
  const raw = normalizeText(value).replace(/[^a-z\u0600-\u06FF]/g, "");
  if (!raw) return FACEBOOK_DEFAULT_COUNTRY;
  if (raw === "ma" || raw === "maroc" || raw === "morocco" || raw.includes("مغرب")) {
    return "ma";
  }
  // ISO-3166 alpha-2 when already two latin letters
  if (/^[a-z]{2}$/.test(raw)) return raw;
  return FACEBOOK_DEFAULT_COUNTRY;
}

function hashIfPresent(value: string | null | undefined, normalizer: (v: string) => string): string | undefined {
  if (!value) return undefined;
  const normalized = normalizer(value);
  if (!normalized) return undefined;
  return sha256(normalized);
}

/**
 * Build CAPI `user_data` object with SHA-256 hashed PII fields.
 * IP / UA / fbp / fbc remain plaintext per Meta requirements.
 */
export function buildHashedUserData(input: FacebookUserDataInput = {}): Record<string, unknown> {
  const em = hashIfPresent(input.email ?? undefined, normalizeText);
  const ph = hashIfPresent(input.phone ?? undefined, normalizePhoneForMeta);
  const fn = hashIfPresent(input.firstName ?? undefined, normalizeText);
  const ln = hashIfPresent(input.lastName ?? undefined, normalizeText);
  const ct = hashIfPresent(input.city ?? undefined, (v) => {
    const n = normalizeText(v);
    // Form currently sends "المغرب" as city — skip low-quality city hashes
    if (!n || n.includes("مغرب") || n === "morocco" || n === "maroc") return "";
    return n;
  });
  const st = hashIfPresent(input.state ?? undefined, normalizeText);
  const zp = hashIfPresent(input.zip ?? undefined, normalizeText);
  const country = hashIfPresent(input.country ?? FACEBOOK_DEFAULT_COUNTRY, normalizeCountry);
  const externalId = hashIfPresent(input.externalId ?? undefined, normalizeText);

  const userData: Record<string, unknown> = {};

  if (em) userData.em = [em];
  if (ph) userData.ph = [ph];
  if (fn) userData.fn = [fn];
  if (ln) userData.ln = [ln];
  if (ct) userData.ct = [ct];
  if (st) userData.st = [st];
  if (zp) userData.zp = [zp];
  if (country) userData.country = [country];
  if (externalId) userData.external_id = [externalId];

  // Matching quality boosters — never hashed
  if (input.clientIpAddress && input.clientIpAddress !== "unknown") {
    userData.client_ip_address = input.clientIpAddress;
  }
  if (input.clientUserAgent) {
    userData.client_user_agent = input.clientUserAgent;
  }
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  return userData;
}
