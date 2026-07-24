/**
 * Anti Fake Orders System — Moroccan COD
 *
 * Modular fraud pipeline: phone → fingerprint → IP → device → bot →
 * rate limit → velocity → blacklist → risk score → decision.
 */

export { evaluateOrderFraud } from "./engine";
export { FRAUD_CONFIG } from "./config";
export {
  validateMoroccanPhone,
  normalizeMoroccanPhoneLocal,
  toInternationalMoroccan,
  phonesMatch,
} from "./phone";
export {
  getFraudDashboardStats,
  getFraudLogs,
  getBlacklist,
  addToBlacklist,
  removeFromBlacklist,
  fraudStore,
} from "./store";
export { clearOrderRateLimits } from "./rate-limit";
export type {
  FraudEvaluation,
  FraudRequestContext,
  FraudDecision,
  FraudLogEntry,
  BlacklistEntry,
  BlacklistType,
  FraudDashboardStats,
  DeviceSignals,
} from "./types";
