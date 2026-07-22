/**
 * Backward-compatible fraud facade used by the order orchestrator.
 * Delegates to the modular Anti Fake Orders engine in `@/lib/fraud`.
 */

import { evaluateOrderFraud, type DeviceSignals, type FraudEvaluation } from "@/lib/fraud";
import type { StoredOrder } from "./memory-store";

export interface FraudResult {
  score: number;
  flags: string[];
  decision: "allow" | "review" | "block";
  reason: string;
  isDuplicate: boolean;
  duplicateOf?: string;
  reasons?: string[];
  breakdown?: FraudEvaluation["breakdown"];
  phoneNormalized?: string;
  fingerprint?: string;
  deviceId?: string;
  ipRisk?: string;
  durationMs?: number;
}

export interface AnalyzeFraudInput {
  phone: string;
  email?: string;
  city: string;
  address: string;
  fullName?: string;
  total: number;
  items: Array<{ sku: string; quantity: number; name: string }>;
  ip?: string;
  userAgent?: string;
  acceptLanguage?: string;
  honeypot?: string;
  formFillMs?: number;
  device?: DeviceSignals;
  headers?: Record<string, string | null | undefined>;
}

export async function analyzeOrderFraud(input: AnalyzeFraudInput): Promise<FraudResult> {
  const evaluation = await evaluateOrderFraud({
    phone: input.phone,
    fullName: input.fullName || "",
    address: input.address,
    city: input.city,
    email: input.email,
    total: input.total,
    items: input.items,
    ip: input.ip || "unknown",
    userAgent: input.userAgent,
    acceptLanguage: input.acceptLanguage,
    honeypot: input.honeypot,
    formFillMs: input.formFillMs,
    device: input.device,
    headers: input.headers,
  });

  return {
    score: evaluation.score,
    flags: evaluation.flags,
    decision: evaluation.legacyDecision,
    reason: evaluation.reason,
    isDuplicate: evaluation.isDuplicate,
    duplicateOf: evaluation.duplicateOf,
    reasons: evaluation.reasons,
    breakdown: evaluation.breakdown,
    phoneNormalized: evaluation.phoneNormalized,
    fingerprint: evaluation.fingerprint,
    deviceId: evaluation.deviceId,
    ipRisk: evaluation.ipRisk,
    durationMs: evaluation.durationMs,
  };
}

/** @deprecated Prefer evaluateOrderFraud — kept for older imports */
export function detectDuplicateOrder(_input: {
  phone: string;
  address: string;
  total: number;
  items: Array<{ sku: string; quantity: number }>;
}): { isDuplicate: boolean; duplicateOf?: string; flags: string[] } {
  return { isDuplicate: false, flags: [] };
}

export function applyFraudToOrder(order: StoredOrder, fraud: FraudResult): StoredOrder {
  order.fraudScore = fraud.score;
  order.fraudFlags = fraud.flags;
  order.isDuplicate = fraud.isDuplicate;
  order.duplicateOf = fraud.duplicateOf;
  if (fraud.phoneNormalized) order.phone = fraud.phoneNormalized;
  if (fraud.decision === "block") order.status = "cancelled";
  if (fraud.decision === "review") order.status = "review";
  return order;
}
