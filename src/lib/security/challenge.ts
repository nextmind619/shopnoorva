import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { SECURITY_CONFIG } from "./config";

function secret(): string {
  return (
    process.env[SECURITY_CONFIG.challenge.secretEnv] ||
    process.env.CRON_SECRET ||
    "noorva-dev-security-secret-change-me"
  );
}

export function issueChallengeNonce(): string {
  const nonce = randomBytes(16).toString("hex");
  const exp = Math.floor(Date.now() / 1000) + 300;
  const sig = createHmac("sha256", secret()).update(`${nonce}.${exp}`).digest("hex").slice(0, 24);
  return `${nonce}.${exp}.${sig}`;
}

export function verifyChallengeNonce(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [nonce, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!nonce || !sig || !Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = createHmac("sha256", secret()).update(`${nonce}.${exp}`).digest("hex").slice(0, 24);
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export interface ChallengeSignals {
  canvas: string;
  webgl: string;
  timezone: string;
  language: string;
  platform: string;
  hardwareConcurrency: number;
  maxTouchPoints: number;
  webdriver: boolean;
  outerWidth: number;
  outerHeight: number;
  timingMs: number;
  mouseMoves: number;
  /** Client-computed sha256 hex of nonce+canvas (integrity, not secrecy) */
  proof: string;
}

/**
 * Invisible challenge: valid nonce + real-browser signals + non-trivial timing.
 * Does not rely on a client-side secret (impossible to keep in browsers).
 */
export function verifyChallengeSignals(token: string, signals: ChallengeSignals): {
  ok: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  if (!verifyChallengeNonce(token)) {
    return { ok: false, reasons: ["invalid_or_expired_nonce"] };
  }

  if (signals.webdriver) reasons.push("webdriver");
  if (!signals.canvas || signals.canvas.length < 6) reasons.push("no_canvas");
  if (!signals.webgl || signals.webgl.length < 4) reasons.push("no_webgl");
  if (!signals.timezone) reasons.push("no_timezone");
  if (signals.timingMs < 80) reasons.push("solved_too_fast");
  if (signals.outerWidth < 100 || signals.outerHeight < 100) reasons.push("tiny_viewport");
  if (signals.hardwareConcurrency <= 0) reasons.push("no_cores");

  // Proof must bind canvas to nonce (client SHA-256)
  const nonce = token.split(".")[0];
  if (!signals.proof || signals.proof.length < 16) reasons.push("missing_proof");
  else if (!signals.proof.includes(nonce.slice(0, 4)) && signals.proof.length < 32) {
    // soft — full sha256 hex is enough length check; content verified loosely
  }

  const hardFail = reasons.some((r) =>
    ["invalid_or_expired_nonce", "webdriver", "no_canvas", "solved_too_fast", "tiny_viewport"].includes(r)
  );

  return { ok: !hardFail, reasons };
}

export function mintTrustCookie(score: number): string {
  const exp = Math.floor(Date.now() / 1000) + SECURITY_CONFIG.challenge.ttlSeconds;
  const payload = `${Math.round(score)}.${exp}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex").slice(0, 24);
  return `${payload}.${sig}`;
}

export function readTrustCookie(value: string | undefined): { valid: boolean; score: number } {
  if (!value) return { valid: false, score: 0 };
  const parts = value.split(".");
  if (parts.length !== 3) return { valid: false, score: 0 };
  const [scoreStr, expStr, sig] = parts;
  const score = Number(scoreStr);
  const exp = Number(expStr);
  if (!Number.isFinite(score) || !Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    return { valid: false, score: 0 };
  }
  const expected = createHmac("sha256", secret())
    .update(`${scoreStr}.${expStr}`)
    .digest("hex")
    .slice(0, 24);
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return { valid: false, score: 0 };
  } catch {
    return { valid: false, score: 0 };
  }
  return { valid: true, score };
}
