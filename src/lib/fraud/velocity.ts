import { FRAUD_CONFIG } from "./config";
import { normalizeAddressKey } from "./velocity-utils";
import type { VelocityHit } from "./types";

export interface AttemptRecord {
  id: string;
  createdAt: number;
  phone: string;
  fullName: string;
  address: string;
  addressKey: string;
  ip: string;
  fingerprint: string;
  deviceId: string;
  decision: string;
}

function distinctCount(values: string[]): number {
  return new Set(values.map((v) => v.trim().toLowerCase()).filter(Boolean)).size;
}

/**
 * Velocity abuse patterns common in Moroccan COD fake-order farms.
 */
export function detectVelocity(
  current: {
    phone: string;
    fullName: string;
    address: string;
    ip: string;
    fingerprint: string;
  },
  history: AttemptRecord[]
): VelocityHit[] {
  const { windowMs, maxDistinctNamesPerIp, maxDistinctNamesPerPhone, maxDistinctPhonesPerAddress, maxDistinctPhonesPerFingerprint } =
    FRAUD_CONFIG.velocity;
  const since = Date.now() - windowMs;
  const recent = history.filter((h) => h.createdAt >= since);
  const hits: VelocityHit[] = [];

  const sameIp = recent.filter((h) => h.ip === current.ip && current.ip !== "unknown");
  if (sameIp.length > 0) {
    const names = distinctCount([...sameIp.map((h) => h.fullName), current.fullName]);
    if (names > maxDistinctNamesPerIp) {
      hits.push({
        key: "ip_many_names",
        detail: `Same IP used ${names} different names`,
        severity: "high",
      });
    }
  }

  const samePhone = recent.filter((h) => h.phone === current.phone);
  if (samePhone.length > 0) {
    const names = distinctCount([...samePhone.map((h) => h.fullName), current.fullName]);
    if (names > maxDistinctNamesPerPhone) {
      hits.push({
        key: "phone_many_names",
        detail: `Same phone used ${names} different names`,
        severity: "high",
      });
    }
  }

  const addressKey = normalizeAddressKey(current.address);
  const sameAddress = recent.filter((h) => h.addressKey === addressKey && addressKey.length >= 8);
  if (sameAddress.length > 0) {
    const phones = distinctCount([...sameAddress.map((h) => h.phone), current.phone]);
    if (phones > maxDistinctPhonesPerAddress) {
      hits.push({
        key: "address_many_phones",
        detail: `Same address used ${phones} different phones`,
        severity: "high",
      });
    }
  }

  const sameFp = recent.filter((h) => h.fingerprint === current.fingerprint && current.fingerprint);
  if (sameFp.length > 0) {
    const phones = distinctCount([...sameFp.map((h) => h.phone), current.phone]);
    if (phones > maxDistinctPhonesPerFingerprint) {
      hits.push({
        key: "fingerprint_many_phones",
        detail: `Same fingerprint used ${phones} different phones`,
        severity: "high",
      });
    }
  }

  return hits;
}

export { normalizeAddressKey };
