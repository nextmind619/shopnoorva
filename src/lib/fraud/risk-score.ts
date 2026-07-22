import { FRAUD_CONFIG } from "./config";
import type { FraudDecision, LegacyFraudDecision, ScoreBreakdownItem } from "./types";
import type { IpRiskType } from "./types";

export interface ScoreInput {
  validPhone: boolean;
  fakePhone: boolean;
  ipRisk: IpRiskType;
  realBrowser: boolean;
  deviceConsistent: boolean;
  addressOk: boolean;
  humanOk: boolean;
  bot: boolean;
  headless: boolean;
  honeypot: boolean;
  blacklisted: boolean;
  rateLimited: boolean;
  repeatedPhone: boolean;
  repeatedFingerprint: boolean;
  repeatedDevice: boolean;
  velocityHigh: boolean;
  formTooFast: boolean;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Trust/legitimacy score 0–100 (higher = safer), per product requirements.
 */
export function calculateRiskScore(input: ScoreInput): {
  score: number;
  breakdown: ScoreBreakdownItem[];
  decision: FraudDecision;
  legacyDecision: LegacyFraudDecision;
} {
  const w = FRAUD_CONFIG.weights;
  const breakdown: ScoreBreakdownItem[] = [];
  let score = 0;

  const add = (key: string, delta: number, detail: string) => {
    if (delta === 0) return;
    score += delta;
    breakdown.push({ key, delta, detail });
  };

  if (input.blacklisted) {
    add("blacklisted", w.blacklisted, "Entity is on blacklist");
  }

  if (input.validPhone) add("valid_phone", w.validPhone, "Valid Moroccan mobile");
  else add("invalid_phone", w.invalidPhone, "Invalid Moroccan phone");

  if (input.fakePhone) add("fake_phone_pattern", w.fakePhonePattern, "Obviously fake phone pattern");

  if (input.ipRisk === "residential" || input.ipRisk === "unknown") {
    if (input.ipRisk === "residential") {
      add("normal_ip", w.normalIp, "Normal IP");
      add("residential_ip", w.residentialIp, "Residential IP");
    } else {
      add("normal_ip", Math.floor(w.normalIp / 2), "IP risk unknown");
    }
  } else if (input.ipRisk === "vpn") {
    add("vpn", w.vpn, "VPN detected");
  } else if (input.ipRisk === "proxy") {
    add("proxy", w.proxy, "Proxy detected");
  } else if (input.ipRisk === "tor") {
    add("tor", w.tor, "Tor exit detected");
  } else if (input.ipRisk === "datacenter") {
    add("datacenter", w.datacenter, "Datacenter IP");
  }

  if (input.realBrowser) add("real_browser", w.realBrowser, "Real browser signals");
  if (input.humanOk) add("human_signals", w.humanSignals, "Human interaction signals");
  if (input.deviceConsistent) add("device_consistency", w.deviceConsistency, "Consistent device profile");
  if (input.addressOk) add("address_quality", w.addressQuality, "Address looks complete");

  if (input.bot) add("bot_detected", w.botDetected, "Automation / bot detected");
  if (input.headless) add("headless", w.headless, "Headless browser");
  if (input.honeypot) add("honeypot", w.honeypotTriggered, "Honeypot field filled");
  if (input.repeatedPhone) add("repeated_phone", w.repeatedPhone, "Repeated phone abuse");
  if (input.repeatedFingerprint) add("repeated_fingerprint", w.repeatedFingerprint, "Repeated fingerprint abuse");
  if (input.repeatedDevice) add("repeated_device", w.repeatedDevice, "Repeated device abuse");
  if (input.rateLimited) add("fast_multiple_orders", w.fastMultipleOrders, "Too many orders in window");
  if (input.velocityHigh) add("velocity", w.velocitySuspicious, "Velocity anomaly");
  if (input.formTooFast) add("form_too_fast", w.formTooFast, "Form submitted too quickly");

  score = clamp(score);

  // Hard rejects override bands
  let decision: FraudDecision;
  if (
    input.blacklisted ||
    input.honeypot ||
    input.bot ||
    input.fakePhone ||
    !input.validPhone ||
    input.ipRisk === "tor"
  ) {
    decision = "reject";
    score = Math.min(score, 40);
  } else if (score >= FRAUD_CONFIG.scoreBands.acceptMin) {
    decision = "accept";
  } else if (score >= FRAUD_CONFIG.scoreBands.reviewMin) {
    decision = "review";
  } else {
    decision = "reject";
  }

  // Rate-limit alone → review if otherwise decent, reject if already low
  if (input.rateLimited && decision === "accept") {
    decision = "review";
  }

  const legacyDecision: LegacyFraudDecision =
    decision === "accept" ? "allow" : decision === "reject" ? "block" : "review";

  return { score, breakdown, decision, legacyDecision };
}
