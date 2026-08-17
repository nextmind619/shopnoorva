import { NextRequest, NextResponse } from "next/server";
import {
  issueChallengeNonce,
  mintTrustCookie,
  verifyChallengeSignals,
  type ChallengeSignals,
} from "@/lib/security";
import { SECURITY_CONFIG } from "@/lib/security/config";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (!rateLimit(`sec-ch-get:${ip}`, 30, 60000).success) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }
  const token = issueChallengeNonce();
  const res = NextResponse.json({ token, ts: Date.now() });
  res.cookies.set(SECURITY_CONFIG.challenge.challengeCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 300,
  });
  return res;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!rateLimit(`sec-ch-post:${ip}`, 20, 60000).success) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const body = (await request.json()) as {
      token?: string;
      signals?: ChallengeSignals;
    };
    const cookieToken = request.cookies.get(SECURITY_CONFIG.challenge.challengeCookie)?.value;
    const token = body.token || cookieToken || "";
    if (!body.signals) {
      return NextResponse.json({ ok: false, error: "missing_signals" }, { status: 400 });
    }

    const result = verifyChallengeSignals(token, body.signals);
    if (!result.ok) {
      return NextResponse.json({ ok: false, reasons: result.reasons }, { status: 403 });
    }

    // Base trust after challenge — Moroccan soft bump applied later by proxy via cookie score
    let score = 75;
    if (/Africa\/Casablanca/i.test(body.signals.timezone || "")) score += 10;
    if (/^(ar|fr)/i.test(body.signals.language || "")) score += 5;
    score = Math.min(100, score);

    const trust = mintTrustCookie(score);
    const res = NextResponse.json({ ok: true, score });
    res.cookies.set(SECURITY_CONFIG.challenge.cookieName, trust, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SECURITY_CONFIG.challenge.ttlSeconds,
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
}
