import { uid } from "@/lib/ai/memory-store";
import { detectBot, isHoneypotTriggered } from "./bot-detection";
import { FRAUD_CONFIG } from "./config";
import { analyzeDevice } from "./device";
import { buildFingerprint, resolveDeviceId } from "./fingerprint";
import { analyzeIpReputation, enrichIpReputation } from "./ip-reputation";
import { validateMoroccanPhone } from "./phone";
import { checkOrderRateLimits, getAttemptCount, recordOrderAttempt } from "./rate-limit";
import { calculateRiskScore } from "./risk-score";
import {
  autoBlacklistOnReject,
  isBlacklisted,
  pushFraudLog,
  recordAttempt,
  getAttempts,
} from "./store";
import type { FraudEvaluation, FraudRequestContext } from "./types";
import { detectVelocity } from "./velocity";

function addressLooksOk(address: string): boolean {
  const t = address.trim();
  if (t.length < 12) return false;
  if (/test|asdf|xxx|fake|lorem|123456/i.test(t)) return false;
  return true;
}

/**
 * Full anti-fake-order evaluation. Target: <300ms.
 * Pure local heuristics + optional IP API with hard timeout.
 */
export async function evaluateOrderFraud(ctx: FraudRequestContext): Promise<FraudEvaluation> {
  const started = Date.now();
  const reasons: string[] = [];
  const flags: string[] = [];

  const phoneResult = validateMoroccanPhone(ctx.phone);
  const phoneNormalized = phoneResult.normalized;
  if (!phoneResult.valid) {
    reasons.push(...phoneResult.reasons);
    flags.push(...phoneResult.reasons);
  } else if (phoneResult.reasons.length) {
    flags.push(...phoneResult.reasons);
  }

  const fakePhone = phoneResult.reasons.includes("fake_phone_pattern");

  const fingerprint = buildFingerprint(ctx.device, ctx.ip, ctx.userAgent || ctx.device?.userAgent);
  const deviceId = resolveDeviceId(ctx.device, fingerprint);

  const blacklistHit = isBlacklisted({
    phone: phoneNormalized || ctx.phone,
    ip: ctx.ip,
    fingerprint,
    device: deviceId,
  });
  if (blacklistHit.blocked) {
    reasons.push(`blacklisted:${blacklistHit.entry?.type}`);
    flags.push("blacklisted", `blacklist_${blacklistHit.entry?.type}`);
  }

  let ipRep = analyzeIpReputation({
    ip: ctx.ip,
    userAgent: ctx.userAgent || ctx.device?.userAgent,
    headers: ctx.headers,
  });
  // Budget remaining time for optional enrichment
  const elapsed = Date.now() - started;
  if (elapsed < 180) {
    ipRep = await enrichIpReputation(ipRep, ctx.ip, Math.min(120, 250 - elapsed));
  }
  if (ipRep.highRisk) {
    flags.push(`ip_${ipRep.risk}`);
    reasons.push(`ip_${ipRep.risk}`);
  }

  const deviceAnalysis = analyzeDevice(ctx.device, ctx.userAgent);
  flags.push(...deviceAnalysis.reasons.map((r) => `device_${r}`));

  const honeypot = isHoneypotTriggered(ctx.honeypot);
  if (honeypot) {
    reasons.push("honeypot");
    flags.push("honeypot");
  }

  const bot = detectBot({
    userAgent: ctx.userAgent || ctx.device?.userAgent,
    device: ctx.device,
    headers: ctx.headers,
    honeypot: ctx.honeypot,
  });
  if (bot.isBot) {
    reasons.push("bot_detected");
    flags.push("bot_detected");
    if (bot.automationTool) flags.push(`automation:${bot.automationTool}`);
  }
  if (bot.isHeadless) {
    reasons.push("headless_browser");
    flags.push("headless_browser");
  }
  flags.push(...bot.reasons.map((r) => `bot_${r}`));

  const rate = checkOrderRateLimits({
    ip: ctx.ip,
    phone: phoneNormalized || ctx.phone,
    fingerprint,
    deviceId,
  });
  if (!rate.allowed) {
    reasons.push(`rate_limit_${rate.limitedBy}`);
    flags.push("rate_limited", `rate_limit_${rate.limitedBy}`);
  }

  const phoneAttempts = getAttemptCount("phone", phoneNormalized || ctx.phone);
  const fpAttempts = getAttemptCount("fingerprint", fingerprint);
  const deviceAttempts = getAttemptCount("device", deviceId);
  const repeatedPhone = phoneAttempts >= FRAUD_CONFIG.rateLimit.maxOrders;
  const repeatedFingerprint = fpAttempts >= FRAUD_CONFIG.rateLimit.maxOrders;
  const repeatedDevice = deviceAttempts >= FRAUD_CONFIG.rateLimit.maxOrders;
  if (repeatedPhone) flags.push("repeated_phone_abuse");
  if (repeatedFingerprint) flags.push("repeated_fingerprint_abuse");
  if (repeatedDevice) flags.push("repeated_device_abuse");

  const velocityHits = detectVelocity(
    {
      phone: phoneNormalized || ctx.phone,
      fullName: ctx.fullName,
      address: ctx.address,
      ip: ctx.ip,
      fingerprint,
    },
    getAttempts()
  );
  for (const hit of velocityHits) {
    flags.push(`velocity_${hit.key}`);
    reasons.push(hit.key);
  }

  const formTooFast =
    typeof ctx.formFillMs === "number" &&
    ctx.formFillMs > 0 &&
    ctx.formFillMs < FRAUD_CONFIG.minFormFillMs;
  if (formTooFast) {
    flags.push("form_too_fast");
    reasons.push("form_too_fast");
  }

  const addressOk = addressLooksOk(ctx.address || "");
  if (!addressOk) {
    flags.push("weak_address");
    reasons.push("weak_address");
  }

  const humanOk =
    !bot.isBot &&
    !honeypot &&
    !formTooFast &&
    Boolean(ctx.device?.canvasFingerprint || ctx.device?.webglFingerprint);

  const scored = calculateRiskScore({
    validPhone: phoneResult.valid,
    fakePhone,
    ipRisk: ipRep.risk,
    realBrowser: deviceAnalysis.realBrowser,
    deviceConsistent: deviceAnalysis.consistent,
    addressOk,
    humanOk,
    bot: bot.isBot,
    headless: bot.isHeadless,
    honeypot,
    blacklisted: blacklistHit.blocked,
    rateLimited: !rate.allowed,
    repeatedPhone,
    repeatedFingerprint,
    repeatedDevice,
    velocityHigh: velocityHits.some((h) => h.severity === "high"),
    formTooFast,
  });

  // Duplicate soft-check via velocity attempts (same phone+address recently accepted)
  const recentDup = getAttempts().find((a) => {
    const age = Date.now() - a.createdAt;
    return (
      age < FRAUD_CONFIG.rateLimit.windowMs &&
      a.phone === (phoneNormalized || ctx.phone) &&
      a.addressKey.length > 0 &&
      a.decision === "accept"
    );
  });

  let decision = scored.decision;
  let legacyDecision = scored.legacyDecision;
  let score = scored.score;
  let isDuplicate = false;
  let duplicateOf: string | undefined;

  if (recentDup && rate.counts.phone >= 1) {
    isDuplicate = true;
    duplicateOf = recentDup.id;
    flags.push("duplicate_order_window");
    reasons.push("duplicate_order_window");
    if (decision === "accept") {
      decision = "review";
      legacyDecision = "review";
    }
  }

  const uniqueReasons = Array.from(new Set(reasons));
  const uniqueFlags = Array.from(new Set(flags));

  const reasonSummary =
    decision === "accept"
      ? "Order passed anti-fraud checks"
      : decision === "review"
        ? `Manual review: ${uniqueReasons.slice(0, 3).join(", ") || "elevated risk"}`
        : `Rejected: ${uniqueReasons.slice(0, 3).join(", ") || "high fraud risk"}`;

  // Persist attempt + rate limit for ALL evaluations (including rejects) to stop farms
  recordOrderAttempt({
    ip: ctx.ip,
    phone: phoneNormalized || ctx.phone,
    fingerprint,
    deviceId,
  });
  recordAttempt({
    phone: phoneNormalized || ctx.phone,
    fullName: ctx.fullName,
    address: ctx.address,
    ip: ctx.ip,
    fingerprint,
    deviceId,
    decision,
  });

  autoBlacklistOnReject({
    decision,
    reasons: uniqueReasons,
    phone: phoneNormalized || ctx.phone,
    ip: ctx.ip,
    fingerprint,
    deviceId,
  });

  const durationMs = Date.now() - started;

  const evaluation: FraudEvaluation = {
    score,
    decision,
    legacyDecision,
    reasons: uniqueReasons,
    flags: uniqueFlags,
    breakdown: scored.breakdown,
    phoneNormalized: phoneNormalized || ctx.phone,
    fingerprint,
    deviceId,
    ipRisk: ipRep.risk,
    isDuplicate,
    duplicateOf,
    blacklisted: blacklistHit.blocked,
    durationMs,
    reason: reasonSummary,
  };

  pushFraudLog({
    id: uid("flog"),
    createdAt: new Date().toISOString(),
    phone: ctx.phone,
    phoneNormalized: evaluation.phoneNormalized,
    fullName: ctx.fullName,
    address: ctx.address,
    ip: ctx.ip,
    fingerprint,
    deviceId,
    score,
    decision,
    reasons: uniqueReasons,
    flags: uniqueFlags,
    breakdown: scored.breakdown,
    ipRisk: ipRep.risk,
    userAgent: ctx.userAgent || ctx.device?.userAgent,
    device: ctx.device,
    durationMs,
  });

  return evaluation;
}
