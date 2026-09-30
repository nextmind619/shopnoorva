import { detectAutomation, isRealBrowserUa, likelyMoroccanCustomer } from "./automation";
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

  const country = (ctx.headers?.["cf-ipcountry"] || "").toUpperCase();
  const auto = detectAutomation(ctx.userAgent, ctx.headers);
  const realBrowser = isRealBrowserUa(ctx.userAgent, ctx.headers);
  const morocco = likelyMoroccanCustomer(ctx.acceptLanguage, undefined, country);
  const ip = evaluateVisitorIp({
    ip: ctx.ip,
    userAgent: ctx.userAgent,
    headers: ctx.headers,
  });

  const bl = isSecurityBlacklisted(ctx.ip, ctx.userAgent);
  const ignoreAutoBlacklist =
    bl?.source === "auto" &&
    realBrowser &&
    !auto.selenium &&
    !auto.puppeteer &&
    !auto.playwright &&
    !auto.isHeadless &&
    ip.kind !== "tor";
  if (bl && !ignoreAutoBlacklist) {
    reasons.push("blacklisted");
    flags.push(`blacklist_${bl.type}`);
  } else if (ignoreAutoBlacklist) {
    flags.push("auto_blacklist_ignored");
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

  if (ip.highRisk) {
    flags.push(`ip_${ip.kind}`);
    reasons.push(`ip_${ip.kind}`);
  }

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

  if (morocco) flags.push("likely_moroccan");
  if (country === "MA") flags.push("cf_country_ma");

  const scored = calculateVisitorTrust({
    blacklisted: Boolean(bl && !ignoreAutoBlacklist),
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
  const score = scored.score;

  // Extra checks when referrer missing or suspicious
  if ((ref.missing || ref.suspicious) && !ctx.challengePassed && !realAdClick && !socialTraffic) {
    if (decision === "allow" && (ip.highRisk || auto.isBot || velocity.rapid)) {
      decision = "challenge";
      reasons.push("elevated_checks_no_referrer");
    }
  }

  const manualBlacklist = Boolean(bl && bl.source === "manual");
  const hostileAutomation = auto.selenium || auto.puppeteer || auto.playwright || auto.isHeadless;
  const abusiveNetwork =
    ip.kind === "tor" || ip.kind === "datacenter" || ip.kind === "vpn" || ip.kind === "proxy";
  const moroccanShopper = country === "MA" || morocco;

  // Storefront is Morocco COD — real browsers should browse without an ad click or cf-ipcountry.
  // Keep blocks for Tor, automation, Ad Library, manual bans, and aggressive crawls.
  if (
    decision === "block" &&
    realBrowser &&
    !manualBlacklist &&
    !hostileAutomation &&
    !ref.facebookAdLibrary &&
    !velocity.rapid &&
    !velocity.massVisit &&
    ip.kind !== "tor"
  ) {
    if (moroccanShopper && !ref.suspicious) {
      decision = abusiveNetwork ? "challenge" : "allow";
      flags.push("moroccan_shopper_allow");
    } else if (!abusiveNetwork) {
      decision = "allow";
      flags.push("real_browser_allow");
    } else {
      decision = "challenge";
      flags.push("real_browser_soft_challenge");
    }
  }

  if (
    ctx.challengePassed &&
    decision === "block" &&
    !manualBlacklist &&
    !hostileAutomation &&
    ip.kind !== "tor" &&
    !ref.facebookAdLibrary
  ) {
    decision = "allow";
    flags.push("challenge_recovered");
  }

  if (decision === "block") {
    const skipAutoBlacklist =
      realBrowser &&
      !auto.selenium &&
      !auto.puppeteer &&
      !auto.playwright &&
      !auto.isHeadless &&
      ip.kind !== "tor" &&
      !ref.facebookAdLibrary;
    const blockCount = recordBlock(ctx.ip);
    if (!skipAutoBlacklist && (shouldAutoBlacklist(ctx.ip) || blockCount >= 3)) {
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
