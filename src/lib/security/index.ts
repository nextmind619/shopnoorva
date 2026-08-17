/**
 * Anti-spy / competitor visitor protection for NOORVA storefront.
 */

export { evaluateVisitor } from "./engine";
export { SECURITY_CONFIG } from "./config";
export { extractClientIp } from "./client-ip";
export {
  issueChallengeNonce,
  verifyChallengeNonce,
  verifyChallengeSignals,
  mintTrustCookie,
  readTrustCookie,
} from "./challenge";
export {
  getSecurityLogs,
  getSecurityBlacklist,
  getSecurityStats,
  addSecurityBlacklist,
  pushSecurityLog,
} from "./store";
export type {
  VisitorEvaluation,
  VisitorContext,
  VisitorDecision,
  SecurityLogEntry,
  ClientSecurityReport,
} from "./types";
export type { ChallengeSignals } from "./challenge";
