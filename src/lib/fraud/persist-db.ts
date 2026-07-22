import { getPool, isDbConfigured } from "@/lib/db";
import type { BlacklistEntry, FraudLogEntry } from "./types";

/**
 * Optional Postgres write-through. Memory store remains the live source
 * so fraud stays <300ms even when DB is slow/unavailable.
 */
export async function persistFraudLog(entry: FraudLogEntry): Promise<void> {
  if (!isDbConfigured()) return;
  const pool = getPool();
  await pool.query(
    `INSERT INTO fraud_logs (
      phone, phone_normalized, full_name, address, ip, fingerprint, device_id,
      score, decision, reasons, flags, breakdown, ip_risk, user_agent, device,
      order_number, duration_ms, created_at
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12::jsonb,$13,$14,$15::jsonb,$16,$17,$18
    )`,
    [
      entry.phone,
      entry.phoneNormalized,
      entry.fullName,
      entry.address,
      entry.ip,
      entry.fingerprint,
      entry.deviceId,
      entry.score,
      entry.decision,
      JSON.stringify(entry.reasons),
      JSON.stringify(entry.flags),
      JSON.stringify(entry.breakdown),
      entry.ipRisk,
      entry.userAgent || null,
      JSON.stringify(entry.device || {}),
      entry.orderNumber || null,
      entry.durationMs,
      entry.createdAt,
    ]
  );
}

export async function persistBlacklistEntry(entry: BlacklistEntry): Promise<void> {
  if (!isDbConfigured()) return;
  const pool = getPool();
  await pool.query(
    `INSERT INTO fraud_blacklist (type, value, reason, source, hits, last_hit_at, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (type, value) DO UPDATE SET
       reason = EXCLUDED.reason,
       hits = fraud_blacklist.hits + 1,
       last_hit_at = NOW()`,
    [
      entry.type,
      entry.value,
      entry.reason,
      entry.source,
      entry.hits,
      entry.lastHitAt || null,
      entry.createdAt,
    ]
  );
}
