import { analyzeIpReputation, type IpReputationResult } from "@/lib/fraud/ip-reputation";
import type { IpRiskKind } from "./types";

/**
 * Reuse fraud IP heuristics for visitor protection (datacenter / VPN / proxy / Tor).
 */
export function evaluateVisitorIp(input: {
  ip: string;
  userAgent?: string;
  headers?: Record<string, string | null | undefined>;
}): IpReputationResult & { kind: IpRiskKind } {
  const result = analyzeIpReputation(input);
  return { ...result, kind: result.risk as IpRiskKind };
}
