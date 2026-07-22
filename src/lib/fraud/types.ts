/** Anti Fake Orders — shared types */

export type FraudDecision = "accept" | "review" | "reject";

/** Mapped to existing order status pipeline */
export type LegacyFraudDecision = "allow" | "review" | "block";

export type BlacklistType = "phone" | "ip" | "fingerprint" | "device";

export type IpRiskType = "residential" | "vpn" | "proxy" | "tor" | "datacenter" | "unknown";

export interface DeviceSignals {
  timezone?: string;
  language?: string;
  languages?: string[];
  screenResolution?: string;
  screenWidth?: number;
  screenHeight?: number;
  colorDepth?: number;
  platform?: string;
  userAgent?: string;
  touchSupport?: boolean;
  maxTouchPoints?: number;
  canvasFingerprint?: string;
  webglFingerprint?: string;
  webglVendor?: string;
  webglRenderer?: string;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  cookieEnabled?: boolean;
  doNotTrack?: string | null;
  vendor?: string;
  /** navigator.webdriver */
  webdriver?: boolean;
  /** Client-computed composite hash */
  fingerprint?: string;
  /** Device id persisted in localStorage */
  deviceId?: string;
}

export interface FraudRequestContext {
  phone: string;
  fullName: string;
  address: string;
  city?: string;
  email?: string;
  total: number;
  items: Array<{ sku: string; quantity: number; name?: string }>;
  ip: string;
  userAgent?: string;
  acceptLanguage?: string;
  /** Invisible honeypot field — must stay empty */
  honeypot?: string;
  /** Timing: ms between page load and submit */
  formFillMs?: number;
  /** Client device / fingerprint payload */
  device?: DeviceSignals;
  /** Extra headers useful for bot detection */
  headers?: Record<string, string | null | undefined>;
}

export interface ScoreBreakdownItem {
  key: string;
  delta: number;
  detail: string;
}

export interface FraudEvaluation {
  /** Trust/legitimacy score 0–100 (higher = safer). User-facing “Risk Score”. */
  score: number;
  decision: FraudDecision;
  legacyDecision: LegacyFraudDecision;
  reasons: string[];
  flags: string[];
  breakdown: ScoreBreakdownItem[];
  phoneNormalized: string;
  fingerprint: string;
  deviceId: string;
  ipRisk: IpRiskType;
  isDuplicate: boolean;
  duplicateOf?: string;
  blacklisted: boolean;
  durationMs: number;
  /** Human-readable summary */
  reason: string;
}

export interface FraudLogEntry {
  id: string;
  createdAt: string;
  phone: string;
  phoneNormalized: string;
  fullName: string;
  address: string;
  ip: string;
  fingerprint: string;
  deviceId: string;
  score: number;
  decision: FraudDecision;
  reasons: string[];
  flags: string[];
  breakdown: ScoreBreakdownItem[];
  ipRisk: IpRiskType;
  userAgent?: string;
  device?: DeviceSignals;
  orderId?: string;
  orderNumber?: string;
  durationMs: number;
}

export interface BlacklistEntry {
  id: string;
  type: BlacklistType;
  value: string;
  reason: string;
  createdAt: string;
  source: "auto" | "manual";
  hits: number;
  lastHitAt?: string;
}

export interface VelocityHit {
  key: string;
  detail: string;
  severity: "medium" | "high";
}

export interface FraudDashboardStats {
  todayFakeAttempts: number;
  blockedIps: number;
  blockedPhones: number;
  blockedFingerprints: number;
  blockedDevices: number;
  highRiskOrders: number;
  acceptedOrders: number;
  rejectedOrders: number;
  reviewOrders: number;
  avgScoreToday: number;
  avgDurationMs: number;
}
