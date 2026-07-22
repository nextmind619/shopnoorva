/**
 * Client-facing Moroccan phone helpers.
 * Canonical fraud normalization lives in `@/lib/fraud/phone`.
 */

import {
  normalizeMoroccanPhoneLocal,
  toInternationalMoroccan,
  validateMoroccanPhone,
} from "@/lib/fraud/phone";

const MIN_ADDRESS_LENGTH = 15;

/** Validates Moroccan mobile numbers (05/06/07) and rejects obvious fakes. */
export function isValidMoroccanPhone(phone: string): boolean {
  return validateMoroccanPhone(phone).valid;
}

/** Normalize to +212… for display / thank-you URLs. */
export function normalizeMoroccanPhone(phone: string): string {
  return toInternationalMoroccan(phone) || normalizeMoroccanPhoneLocal(phone) || phone.replace(/\D/g, "");
}

/** Local COD format 06XXXXXXXX for storage / dedup */
export function normalizeMoroccanPhoneLocalFormat(phone: string): string | null {
  return normalizeMoroccanPhoneLocal(phone);
}

/** Auto-format Moroccan phone as user types (06 XX XX XX XX). */
export function formatMoroccanPhoneInput(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("+")) {
    let digits = trimmed.replace(/\D/g, "");
    if (digits.startsWith("212")) digits = digits.slice(3);
    digits = digits.slice(0, 9);
    if (digits.length === 0) return "+212 ";
    return `+212 ${chunkDigits(digits)}`.trimEnd();
  }

  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("212")) digits = `0${digits.slice(3)}`;
  if (digits.length > 0 && !digits.startsWith("0")) digits = `0${digits}`;
  digits = digits.slice(0, 10);
  return chunkDigits(digits);
}

function chunkDigits(digits: string): string {
  const parts: string[] = [];
  if (digits.length <= 2) return digits;
  parts.push(digits.slice(0, 2));
  for (let i = 2; i < digits.length; i += 2) parts.push(digits.slice(i, i + 2));
  return parts.join(" ");
}

export function isValidAddress(address: string, minLength = MIN_ADDRESS_LENGTH): boolean {
  return address.trim().length >= minLength;
}
