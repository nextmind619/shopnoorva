/**
 * Server-side automation / fake-browser detection for visitors.
 */

export interface AutomationDetection {
  isBot: boolean;
  isHeadless: boolean;
  selenium: boolean;
  puppeteer: boolean;
  playwright: boolean;
  fakeBrowser: boolean;
  reasons: string[];
  tool?: string;
}

const SELENIUM = /selenium|webdriver|chrome-lighthouse/i;
const PUPPETEER = /puppeteer|HeadlessChrome/i;
const PLAYWRIGHT = /playwright|Playwright/i;
const HEADLESS = /HeadlessChrome|PhantomJS|SlimerJS|Electron\/\d/i;
const FAKE_BROWSER =
  /curl\/|wget\/|python-requests|aiohttp|scrapy|httpclient|Go-http-client|Java\/|okhttp|libwww|node-fetch|undici|postman|insomnia|httpie|axios\//i;
const REALISH = /Mozilla\/5\.0.*(Chrome|Firefox|Safari|Edg|Mobile|SamsungBrowser|AppleWebKit|Gecko)/i;

/**
 * Real desktop and mobile browsers.
 * Chrome on Windows is sometimes reduced to
 * `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36`
 * (privacy tools, or a proxy that drops the `Chrome/` + `Safari/` tokens).
 * That string used to miss the old Chrome|Safari check, score as fake_browser,
 * and hard-307 to /access-denied. Product tokens are enough when present;
 * Mozilla/5.0 plus AppleWebKit or Gecko on a real OS is enough when they are not.
 * Client Hints (`sec-ch-ua`) count too. curl, headless, and automation UAs do not.
 */
export function isRealBrowserUa(
  userAgent: string,
  headers?: Record<string, string | null | undefined>
): boolean {
  const ua = userAgent || "";
  if (!ua.trim()) return false;
  if (HEADLESS.test(ua) || SELENIUM.test(ua) || PLAYWRIGHT.test(ua)) return false;
  if (PUPPETEER.test(ua) && !/Edg\//i.test(ua)) return false;
  if (FAKE_BROWSER.test(ua)) return false;

  const hints = headers?.["sec-ch-ua"] || "";
  if (
    hints &&
    /Chromium|Google Chrome|Microsoft Edge|Opera|Firefox/i.test(hints) &&
    !/HeadlessChrome/i.test(hints)
  ) {
    return true;
  }

  const hasEngine = /(AppleWebKit|Gecko|Chrome|Firefox|Safari|Edg|OPR|SamsungBrowser)\//i.test(ua);
  const hasDevice = /(Windows NT|Macintosh|Linux|Android|iPhone|iPad|CrOS|Mobile)/i.test(ua);
  return /Mozilla\/5\.0/i.test(ua) && hasEngine && hasDevice;
}

export function detectAutomation(
  userAgent: string,
  headers?: Record<string, string | null | undefined>
): AutomationDetection {
  const ua = userAgent || "";
  const reasons: string[] = [];

  const selenium = SELENIUM.test(ua);
  const puppeteer = PUPPETEER.test(ua) && !/Edg\//i.test(ua);
  const playwright = PLAYWRIGHT.test(ua);
  const isHeadless = HEADLESS.test(ua);
  const realBrowser = isRealBrowserUa(ua, headers);
  const declaredBot = /bot|crawler|spider|facebookexternalhit|meta-external/i.test(ua);
  const fakeBrowser = !realBrowser && !declaredBot;

  if (selenium) {
    reasons.push("selenium");
  }
  if (puppeteer) reasons.push("puppeteer");
  if (playwright) reasons.push("playwright");
  if (isHeadless) reasons.push("headless_chrome");
  if (fakeBrowser) reasons.push("fake_browser");

  // Header anomalies common in automation
  const accept = headers?.["accept"] || "";
  const acceptLang = headers?.["accept-language"] || "";
  if (REALISH.test(ua) && !accept) reasons.push("missing_accept");
  if (REALISH.test(ua) && !acceptLang) reasons.push("missing_accept_language");

  // Headless Chrome often sends Chrome UA without sec-ch-ua on newer versions
  const secCh = headers?.["sec-ch-ua"];
  if (/Chrome\/1[2-9]\d/i.test(ua) && !secCh && !/Mobile/i.test(ua)) {
    reasons.push("missing_client_hints");
  }

  let tool: string | undefined;
  if (playwright) tool = "playwright";
  else if (puppeteer) tool = "puppeteer";
  else if (selenium) tool = "selenium";
  else if (isHeadless) tool = "headless_chrome";

  const isBot =
    selenium ||
    puppeteer ||
    playwright ||
    isHeadless ||
    fakeBrowser ||
    reasons.filter((r) => ["missing_accept", "missing_accept_language", "missing_client_hints"].includes(r))
      .length >= 2;

  return { isBot, isHeadless, selenium, puppeteer, playwright, fakeBrowser, reasons, tool };
}

/** Soft Moroccan customer heuristics (never hard-block alone) */
export function likelyMoroccanCustomer(
  acceptLanguage: string,
  timezoneFromClient?: string,
  country?: string | null
): boolean {
  if ((country || "").toUpperCase() === "MA") return true;
  const al = (acceptLanguage || "").toLowerCase();
  if (al.includes("ar-ma") || al.includes("fr-ma") || al.includes("ar,") || al.startsWith("ar")) return true;
  if (al.includes("fr") && al.includes("ar")) return true;
  if (timezoneFromClient && /Africa\/Casablanca/i.test(timezoneFromClient)) return true;
  return false;
}
