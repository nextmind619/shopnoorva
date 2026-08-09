import { detectAutomation, likelyMoroccanCustomer } from "./automation";
import { analyzeReferrer, detectRealAdClick, detectSocialTraffic } from "./referrer";
import { evaluateVisitorIp } from "./ip";
import { calculateVisitorTrust } from "./trust-score";
import { recordPageHit, recordBlock, shouldAutoBlacklist } from "./velocity";
import {
  addSecurityBlacklist,
  isSecurityBlacklisted,
  pushSecurityLog,
} from "./store";
import type { VisitorContext, VisitorEvaluation } from "./types";

/**
 * Fast visitor evaluation for edge/proxy (<15ms typical).
 */
export function evaluateVisitor(ctx: VisitorContext): VisitorEvaluation {
  const started = Date.now();
  const reasons: string[] = [];
  const flags: string[] = [];

  const bl = isSecurityBlacklisted(ctx.ip, ctx.userAgent);
  if (bl) {
    reasons.push("blacklisted");
    flags.push(`blacklist_${bl.type}`);
  }

  const ref = analyzeReferrer(ctx.referer);
  reasons.push(...ref.reasons);
  if (ref.facebookAdLibrary) flags.push("facebook_ad_library");
  if (ref.suspicious) flags.push("suspicious_referrer");

  const realAdClick = detectRealAdClick(ctx.searchParams);
  if (realAdClick) flags.push("real_ad_click");

  const socialTraffic = detectSocialTraffic({
    referer: ctx.referer,
    userAgent: ctx.userAgent,
    searchParams: ctx.searchParams,
  });
  if (socialTraffic) flags.push("social_traffic");

  const ip = evaluateVisitorIp({
    ip: ctx.ip,
    userAgent: ctx.userAgent,
    headers: ctx.headers,
  });
  if (ip.highRisk) {
    flags.push(`ip_${ip.kind}`);
    reasons.push(`ip_${ip.kind}`);
  }

  const auto = detectAutomation(ctx.userAgent, ctx.headers);
  flags.push(...auto.reasons.map((r) => `auto_${r}`));
  if (auto.isBot) reasons.push("bot_detected");
  if (auto.tool) reasons.push(auto.tool);

  const velocity = recordPageHit(ctx.ip, ctx.pathname);
  if (velocity.rapid) {
    flags.push("rapid_requests");
    reasons.push("rapid_requests");
  }
  if (velocity.massVisit) {
    flags.push("mass_visits");
    reasons.push("aggressive_crawling");
  }

  const morocco = likelyMoroccanCustomer(ctx.acceptLanguage);
  if (morocco) flags.push("likely_moroccan");

  const realBrowser = /Mozilla\/5\.0.*(Chrome|Firefox|Safari|Edg|Mobile)/i.test(ctx.userAgent);

  const scored = calculateVisitorTrust({
    blacklisted: Boolean(bl),
    realBrowser,
    challengePassed: ctx.challengePassed,
    likelyMoroccan: morocco,
    realAdClick,
    socialTraffic,
    missingReferrer: ref.missing && !socialTraffic,
    suspiciousReferrer: ref.suspicious,
    facebookAdLibrary: ref.facebookAdLibrary,
    ipRisk: ip.kind,
    bot: auto.isBot,
    headless: auto.isHeadless,
    selenium: auto.selenium,
    puppeteer: auto.puppeteer,
    playwright: auto.playwright,
    fakeBrowser: auto.fakeBrowser,
    rapidRequests: velocity.rapid,
    massVisits: velocity.massVisit,
    priorScore: ctx.priorScore,
  });

  let decision = scored.decision;
  let score = scored.score;

  // Extra checks when referrer missing or suspicious
  if ((ref.missing || ref.suspicious) && !ctx.challengePassed && !realAdClick && !socialTraffic) {
    if (decision === "allow" && (ip.highRisk || auto.isBot || velocity.rapid)) {
      decision = "challenge";
      reasons.push("elevated_checks_no_referrer");
    }
  }

  if (decision === "block") {
    const blockCount = recordBlock(ctx.ip);
    if (shouldAutoBlacklist(ctx.ip) || blockCount >= 3) {
      addSecurityBlacklist({
        type: "ip",
        value: ctx.ip,
        reason: scored.breakdown
          .filter((b) => b.delta < 0)
          .slice(0, 3)
          .map((b) => b.key)
          .join(",") || reasons.slice(0, 3).join(",") || "repeated_blocks",
        source: "auto",
      });
      flags.push("auto_blacklisted");
    }
  }

  const uniqueReasons = Array.from(
    new Set([...reasons, ...scored.breakdown.filter((b) => b.delta < 0).map((b) => b.key)])
  );
  const uniqueFlags = Array.from(new Set(flags));

  const evaluation: VisitorEvaluation = {
    score,
    decision,
    reasons: uniqueReasons,
    flags: uniqueFlags,
    breakdown: scored.breakdown,
    ipRisk: ip.kind,
    suspiciousReferrer: ref.suspicious,
    missingReferrer: ref.missing,
    likelyRealAdTraffic: realAdClick,
    likelyMoroccanCustomer: morocco,
    durationMs: Date.now() - started,
  };

  if (evaluation.decision !== "allow" || uniqueFlags.includes("facebook_ad_library")) {
    pushSecurityLog({
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      referer: ctx.referer,
      pathname: ctx.pathname,
      score: evaluation.score,
      decision: evaluation.decision,
      reasons: evaluation.reasons,
      flags: evaluation.flags,
      ipRisk: evaluation.ipRisk,
    });
  }

  return evaluation;
}
