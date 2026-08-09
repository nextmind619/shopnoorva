import { SECURITY_CONFIG } from "./config";
import type { IpRiskKind, ScoreBreakdownItem, VisitorDecision } from "./types";

export interface TrustInput {
  blacklisted: boolean;
  realBrowser: boolean;
  challengePassed: boolean;
  likelyMoroccan: boolean;
  realAdClick: boolean;
  socialTraffic: boolean;
  missingReferrer: boolean;
  suspiciousReferrer: boolean;
  facebookAdLibrary: boolean;
  ipRisk: IpRiskKind;
  bot: boolean;
  headless: boolean;
  selenium: boolean;
  puppeteer: boolean;
  playwright: boolean;
  fakeBrowser: boolean;
  rapidRequests: boolean;
  massVisits: boolean;
  /** Prior trust cookie */
  priorScore?: number;
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Visitor Trust Score 0–100 (higher = safer).
 * Moroccan customers with real ad clicks and browsers stay high even if referrer is missing.
 */
export function calculateVisitorTrust(input: TrustInput): {
  score: number;
  breakdown: ScoreBreakdownItem[];
  decision: VisitorDecision;
} {
  const w = SECURITY_CONFIG.weights;
  const breakdown: ScoreBreakdownItem[] = [];
  let score: number = w.base;

  const add = (key: string, delta: number, detail: string) => {
    score += delta;
    breakdown.push({ key, delta, detail });
  };

  if (input.blacklisted) add("blacklisted", w.blacklisted, "Blacklisted visitor");
  if (input.realBrowser) add("real_browser", w.realBrowser, "Real browser UA");
  if (input.challengePassed) add("challenge", w.challengePassed, "Passed invisible challenge");
  if (input.likelyMoroccan) add("moroccan", w.likelyMoroccan, "Likely Moroccan customer");
  if (input.realAdClick) add("ad_click", w.realAdClick, "Real paid ad click params");
  else if (input.socialTraffic) add("social_traffic", w.socialTraffic, "Social platform traffic");

  if (input.facebookAdLibrary) add("ad_library", w.facebookAdLibrary, "Facebook Ad Library referrer");
  else if (input.suspiciousReferrer) add("suspicious_ref", w.suspiciousReferrer, "Suspicious referrer");
  else if (input.missingReferrer) add("missing_ref", w.missingReferrerSoft, "Missing referrer (soft)");

  if (input.ipRisk === "datacenter") add("datacenter", w.datacenter, "Datacenter IP");
  else if (input.ipRisk === "vpn") add("vpn", w.vpn, "VPN IP");
  else if (input.ipRisk === "proxy") add("proxy", w.proxy, "Proxy IP");
  else if (input.ipRisk === "tor") add("tor", w.tor, "Tor exit");

  if (input.selenium) add("selenium", w.selenium, "Selenium detected");
  if (input.puppeteer) add("puppeteer", w.puppeteer, "Puppeteer detected");
  if (input.playwright) add("playwright", w.playwright, "Playwright detected");
  if (input.headless) add("headless", w.headless, "Headless Chrome");
  if (input.fakeBrowser) add("fake_browser", w.fakeBrowser, "Fake / non-browser client");
  else if (input.bot) add("bot", w.botUa, "Bot signals");

  if (input.rapidRequests) add("rapid", w.rapidRequests, "Rapid requests");
  if (input.massVisits) add("mass", w.massVisits, "Mass page visits / crawl");

  // Blend with prior successful challenge score
  if (input.priorScore && input.priorScore > score) {
    score = Math.round(score * 0.4 + input.priorScore * 0.6);
    breakdown.push({ key: "prior_trust", delta: 0, detail: `Blended prior trust ${input.priorScore}` });
  }

  score = clamp(score);

  /**
   * Safety valve for real Moroccan shoppers:
   * Never hard-block when (Moroccan OR real ad click) AND real browser AND not automation tool
   * unless score is extremely low from clear malice (tor/blacklist/devtools farm).
   */
  const protectedCustomer =
    (input.likelyMoroccan || input.realAdClick || input.socialTraffic) &&
    input.realBrowser &&
    !input.selenium &&
    !input.puppeteer &&
    !input.playwright &&
    !input.headless &&
    !input.blacklisted &&
    input.ipRisk !== "tor";

  let decision: VisitorDecision;
  if (input.blacklisted || input.ipRisk === "tor" || input.selenium || input.puppeteer || input.playwright) {
    decision = "block";
    score = Math.min(score, 30);
  } else if (score >= SECURITY_CONFIG.bands.allowMin) {
    decision = "allow";
  } else if (score >= SECURITY_CONFIG.bands.challengeMin) {
    decision = "challenge";
  } else {
    decision = "block";
  }

  if (protectedCustomer && decision === "block" && score >= 25) {
    decision = "challenge";
  }
  if (
    protectedCustomer &&
    (input.realAdClick || input.socialTraffic) &&
    decision === "challenge" &&
    !input.massVisits
  ) {
    decision = "allow";
  }

  return { score, breakdown, decision };
}
