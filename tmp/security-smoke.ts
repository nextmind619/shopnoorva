import { evaluateVisitor } from "../src/lib/security/engine";
import { calculateVisitorTrust } from "../src/lib/security/trust-score";
import { analyzeReferrer, detectRealAdClick } from "../src/lib/security/referrer";

function main() {
  console.log(
    "ad library",
    analyzeReferrer("https://www.facebook.com/ads/library/?id=123")
  );
  console.log("missing", analyzeReferrer(""));
  console.log("fbclid", detectRealAdClick(new URLSearchParams("fbclid=abc")));

  const moroccoShopper = calculateVisitorTrust({
    blacklisted: false,
    realBrowser: true,
    challengePassed: false,
    likelyMoroccan: true,
    realAdClick: true,
    socialTraffic: false,
    missingReferrer: true,
    suspiciousReferrer: false,
    facebookAdLibrary: false,
    ipRisk: "residential",
    bot: false,
    headless: false,
    selenium: false,
    puppeteer: false,
    playwright: false,
    fakeBrowser: false,
    rapidRequests: false,
    massVisits: false,
  });
  console.log("morocco shopper", moroccoShopper.score, moroccoShopper.decision);

  const spy = calculateVisitorTrust({
    blacklisted: false,
    realBrowser: true,
    challengePassed: false,
    likelyMoroccan: false,
    realAdClick: false,
    socialTraffic: false,
    missingReferrer: false,
    suspiciousReferrer: true,
    facebookAdLibrary: true,
    ipRisk: "datacenter",
    bot: false,
    headless: false,
    selenium: false,
    puppeteer: false,
    playwright: false,
    fakeBrowser: false,
    rapidRequests: true,
    massVisits: true,
  });
  console.log("ad library spy", spy.score, spy.decision);

  const ev = evaluateVisitor({
    ip: "105.154.1.2",
    userAgent:
      "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    referer: "",
    acceptLanguage: "ar-MA,ar;q=0.9,fr-FR;q=0.8",
    pathname: "/ar",
    searchParams: new URLSearchParams("fbclid=TEST"),
    headers: {
      accept: "text/html",
      "accept-language": "ar-MA",
      "sec-ch-ua": "\"Chromium\";v=\"120\"",
    },
    challengePassed: false,
  });
  console.log("eval morocco+fbclid", {
    decision: ev.decision,
    score: ev.score,
    ms: ev.durationMs,
    flags: ev.flags,
  });
}

main();
