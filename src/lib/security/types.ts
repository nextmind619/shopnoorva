/** Anti-spy / anti-scrape visitor protection types */

export type VisitorDecision = "allow" | "challenge" | "block";

export type IpRiskKind = "residential" | "vpn" | "proxy" | "tor" | "datacenter" | "unknown";

export interface VisitorContext {
  ip: string;
  userAgent: string;
  referer: string;
  acceptLanguage: string;
  pathname: string;
  searchParams: URLSearchParams;
  headers: Record<string, string | null | undefined>;
  /** Passed challenge cookie */
  challengePassed: boolean;
  /** Existing trust cookie score if any */
  priorScore?: number;
}

export interface ScoreBreakdownItem {
  key: string;
  delta: number;
  detail: string;
}

export interface VisitorEvaluation {
  score: number;
  decision: VisitorDecision;
  reasons: string[];
  flags: string[];
  breakdown: ScoreBreakdownItem[];
  ipRisk: IpRiskKind;
  suspiciousReferrer: boolean;
  missingReferrer: boolean;
  likelyRealAdTraffic: boolean;
  likelyMoroccanCustomer: boolean;
  durationMs: number;
}

export interface SecurityLogEntry {
  id: string;
  createdAt: string;
  ip: string;
  userAgent: string;
  referer: string;
  pathname: string;
  score: number;
  decision: VisitorDecision;
  reasons: string[];
  flags: string[];
  ipRisk: IpRiskKind;
}

export interface SecurityBlacklistEntry {
  id: string;
  type: "ip" | "fingerprint" | "ua";
  value: string;
  reason: string;
  hits: number;
  createdAt: string;
  source: "auto" | "manual";
}

export interface ClientSecurityReport {
  fingerprint?: string;
  webdriver?: boolean;
  headlessHints?: string[];
  automationTool?: string;
  devtoolsOpen?: boolean;
  scrapeSignals?: string[];
  imageDownloadAttempts?: number;
  rapidNavCount?: number;
  mouseEntropy?: number;
  fakeBrowser?: boolean;
  timezone?: string;
  language?: string;
  challengeToken?: string;
  challengeProof?: string;
}
