import { evaluateVisitor } from "../src/lib/security/engine";
import { isRealBrowserUa } from "../src/lib/security/automation";
import { applyOwnerBypass, isAllowlistedIp } from "../src/lib/security/allowlist";
import { addSecurityBlacklist } from "../src/lib/security/store";
import type { VisitorDecision } from "../src/lib/security/types";

const DESKTOP_CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
/** Seen on the live gate: Windows desktop, Chrome product tokens stripped. */
const REDUCED_DESKTOP =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const MOBILE_CHROME =
  "Mozilla/5.0 (Linux; Android 13; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36";

function browserHeaders(ua: string, extra?: Record<string, string>) {
  return {
    accept: "text/html,application/xhtml+xml",
    "accept-language": "fr-FR,fr;q=0.9",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131"',
    "user-agent": ua,
    ...extra,
  };
}

function visit(input: {
  ip: string;
  ua: string;
  lang?: string;
  referer?: string;
  country?: string;
  challengePassed?: boolean;
  search?: string;
  headers?: Record<string, string>;
}) {
  return evaluateVisitor({
    ip: input.ip,
    userAgent: input.ua,
    referer: input.referer || "",
    acceptLanguage: input.lang || "fr-FR,fr;q=0.9",
    pathname: "/",
    searchParams: new URLSearchParams(input.search || ""),
    headers: input.headers || browserHeaders(input.ua, input.country ? { "cf-ipcountry": input.country } : {}),
    challengePassed: Boolean(input.challengePassed),
  });
}

const failures: string[] = [];

function expectDecision(name: string, actual: VisitorDecision, expected: VisitorDecision) {
  const ok = actual === expected;
  console.log(`${ok ? "ok" : "FAIL"} ${name}: ${actual} (expected ${expected})`);
  if (!ok) failures.push(`${name}: got ${actual}, expected ${expected}`);
}

function main() {
  expectDecision(
    "reduced Windows Chrome, French, no country, no ad, residential",
    visit({ ip: "105.154.20.5", ua: REDUCED_DESKTOP, lang: "fr-FR,fr;q=0.9" }).decision,
    "allow"
  );
  expectDecision(
    "full desktop Chrome, no country, no ad",
    visit({ ip: "105.154.20.6", ua: DESKTOP_CHROME }).decision,
    "allow"
  );
  expectDecision(
    "mobile Chrome Morocco language, no ad click",
    visit({
      ip: "105.154.20.7",
      ua: MOBILE_CHROME,
      lang: "ar-MA,ar;q=0.9,fr;q=0.8",
    }).decision,
    "allow"
  );
  expectDecision(
    "desktop Chrome with cf-ipcountry MA",
    visit({ ip: "105.154.20.8", ua: DESKTOP_CHROME, country: "MA" }).decision,
    "allow"
  );
  expectDecision(
    "client hints only, stripped product tokens",
    visit({
      ip: "105.154.20.9",
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      headers: browserHeaders("Mozilla/5.0 (Windows NT 10.0; Win64; x64)"),
    }).decision,
    "allow"
  );

  expectDecision(
    "curl",
    visit({
      ip: "198.51.100.10",
      ua: "curl/8.14.1",
      headers: { accept: "*/*", "user-agent": "curl/8.14.1" },
    }).decision,
    "block"
  );
  expectDecision(
    "curl spoofing sec-ch-ua",
    visit({
      ip: "198.51.100.11",
      ua: "curl/8.14.1",
      headers: {
        accept: "*/*",
        "user-agent": "curl/8.14.1",
        "sec-ch-ua": '"Google Chrome";v="131"',
      },
    }).decision,
    "block"
  );
  expectDecision(
    "HeadlessChrome",
    visit({
      ip: "198.51.100.12",
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.0.0 Safari/537.36",
    }).decision,
    "block"
  );
  expectDecision(
    "puppeteer",
    visit({
      ip: "198.51.100.13",
      ua: `${DESKTOP_CHROME} Puppeteer`,
    }).decision,
    "block"
  );
  expectDecision(
    "playwright",
    visit({
      ip: "198.51.100.14",
      ua: `${DESKTOP_CHROME} Playwright`,
    }).decision,
    "block"
  );
  expectDecision(
    "tor header",
    visit({
      ip: "105.154.20.30",
      ua: DESKTOP_CHROME,
      headers: browserHeaders(DESKTOP_CHROME, { "x-tor": "1" }),
    }).decision,
    "block"
  );
  expectDecision(
    "facebook ad library",
    visit({
      ip: "105.154.20.31",
      ua: DESKTOP_CHROME,
      referer: "https://www.facebook.com/ads/library/?id=123",
    }).decision,
    "block"
  );
  expectDecision(
    "datacenter real Chrome is challenged, not hard-blocked",
    visit({ ip: "54.160.236.132", ua: DESKTOP_CHROME }).decision,
    "challenge"
  );
  expectDecision(
    "proxy via header real Chrome is challenged",
    visit({
      ip: "105.154.20.40",
      ua: DESKTOP_CHROME,
      headers: browserHeaders(DESKTOP_CHROME, { via: "1.1 nginx-proxy" }),
    }).decision,
    "challenge"
  );

  addSecurityBlacklist({
    type: "ip",
    value: "105.154.77.9",
    reason: "missing_ref,fake_browser",
    source: "auto",
  });
  const pardoned = visit({ ip: "105.154.77.9", ua: REDUCED_DESKTOP });
  expectDecision("auto-blacklist false positive pardoned", pardoned.decision, "allow");
  if (!pardoned.flags.includes("auto_blacklist_ignored")) {
    failures.push("auto-blacklist pardon missing flag");
    console.log("FAIL auto-blacklist flag", pardoned.flags);
  } else {
    console.log("ok auto-blacklist ignored flag");
  }

  addSecurityBlacklist({
    type: "ip",
    value: "105.154.77.10",
    reason: "manual_ban",
    source: "manual",
  });
  expectDecision(
    "manual blacklist still blocks",
    visit({ ip: "105.154.77.10", ua: DESKTOP_CHROME }).decision,
    "block"
  );

  const challengedDatacenter = visit({
    ip: "54.160.236.50",
    ua: REDUCED_DESKTOP,
    challengePassed: true,
  });
  if (challengedDatacenter.decision === "block") {
    failures.push("challengePassed datacenter browser still blocked");
    console.log("FAIL challenge recovery", challengedDatacenter.decision);
  } else {
    console.log("ok challenge recovery not a hard block:", challengedDatacenter.decision);
  }

  if (!isRealBrowserUa(REDUCED_DESKTOP)) {
    failures.push("reduced desktop UA not recognized");
  }
  if (isRealBrowserUa("curl/8.14.1")) {
    failures.push("curl recognized as real browser");
  }
  if (!isAllowlistedIp("105.154.10.20", "41.140.0.0/16, 105.154.10.20")) {
    failures.push("exact allowlist IP missed");
  }
  if (!isAllowlistedIp("41.140.8.8", "41.140.0.0/16")) {
    failures.push("CIDR allowlist missed");
  }
  if (isAllowlistedIp("105.154.10.20", "41.140.0.0/16")) {
    failures.push("CIDR allowlist over-matched");
  }
  if (isAllowlistedIp("unknown", "1.2.3.4")) {
    failures.push("unknown ip allowlisted");
  }
  if (applyOwnerBypass("block", true) !== "allow" || applyOwnerBypass("challenge", false) !== "challenge") {
    failures.push("owner bypass helper");
  }

  if (failures.length) {
    console.error("\n" + failures.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("\nall security gate checks passed");
  }
}

main();
