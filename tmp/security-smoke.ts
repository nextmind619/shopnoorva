import { evaluateVisitor } from "../src/lib/security/engine";
import { isRealBrowserUa, likelyMoroccanCustomer } from "../src/lib/security/automation";

const REDUCED =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function visit(ua: string, lang: string, ip = "105.154.20.5", country?: string) {
  return evaluateVisitor({
    ip,
    userAgent: ua,
    referer: "",
    acceptLanguage: lang,
    pathname: "/ar",
    searchParams: new URLSearchParams(),
    headers: {
      accept: "text/html",
      "accept-language": lang,
      "sec-ch-ua": '"Google Chrome";v="131"',
      "cf-ipcountry": country,
    },
    challengePassed: false,
  });
}

const fails: string[] = [];
function ok(name: string, cond: boolean) {
  console.log(cond ? "ok" : "FAIL", name);
  if (!cond) fails.push(name);
}

ok("fr-FR desktop counts as likely Moroccan", likelyMoroccanCustomer("fr-FR,fr;q=0.9"));
ok("reduced UA is real browser", isRealBrowserUa(REDUCED));
ok(
  "Moroccan fr desktop residential -> allow",
  visit(REDUCED, "fr-FR,fr;q=0.9").decision === "allow"
);
ok(
  "Moroccan ar-MA mobile -> allow",
  visit(
    "Mozilla/5.0 (Linux; Android 13; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
    "ar-MA,ar;q=0.9"
  ).decision === "allow"
);
ok("curl blocked", visit("curl/8.14.1", "", "198.51.100.1").decision === "block");
ok(
  "ad library blocked",
  visit(CHROME, "fr-FR", "105.154.1.1", "MA").decision === "block" ||
    evaluateVisitor({
      ip: "105.154.1.1",
      userAgent: CHROME,
      referer: "https://www.facebook.com/ads/library/?id=1",
      acceptLanguage: "fr-FR",
      pathname: "/ar",
      searchParams: new URLSearchParams(),
      headers: { accept: "text/html", "cf-ipcountry": "MA" },
      challengePassed: false,
    }).decision === "block"
);

if (fails.length) {
  console.error(fails.join("\n"));
  process.exit(1);
}
console.log("security smoke passed");
