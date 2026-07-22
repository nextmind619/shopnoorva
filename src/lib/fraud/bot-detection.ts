import type { DeviceSignals } from "./types";

export interface BotDetectionResult {
  isBot: boolean;
  isHeadless: boolean;
  automationTool?: string;
  reasons: string[];
}

const AUTOMATION_UA =
  /headlesschrome|phantomjs|selenium|webdriver|puppeteer|playwright|scrapy|httpclient|python-requests|aiohttp|curl\/|wget\/|go-http|java\/|okhttp|libwww|node-fetch|undici|postman|insomnia|httpie/i;

const HEADLESS_UA = /HeadlessChrome|Electron\/|SlimerJS|Nightmare/i;

/**
 * Detect Playwright, Puppeteer, Selenium, Headless Chrome and similar automation.
 */
export function detectBot(input: {
  userAgent?: string;
  device?: DeviceSignals;
  headers?: Record<string, string | null | undefined>;
  honeypot?: string;
}): BotDetectionResult {
  const reasons: string[] = [];
  let automationTool: string | undefined;
  const ua = input.userAgent || input.device?.userAgent || input.headers?.["user-agent"] || "";

  if (input.honeypot && input.honeypot.trim().length > 0) {
    reasons.push("honeypot");
  }

  if (AUTOMATION_UA.test(ua)) {
    reasons.push("automation_ua");
    const m = ua.match(AUTOMATION_UA);
    automationTool = m?.[0]?.toLowerCase();
  }

  if (HEADLESS_UA.test(ua)) {
    reasons.push("headless_ua");
    automationTool = automationTool || "headless_chrome";
  }

  const headers = input.headers || {};
  // Selenium / WebDriver often injects these
  if (headers["x-devtools-emulate-network-conditions-client-id"]) {
    reasons.push("devtools_emulation");
  }

  const device = input.device;
  if (device) {
    if (device.webdriver) {
      reasons.push("webdriver_flag");
      automationTool = automationTool || "webdriver";
    }

    // Headless often reports 0 plugins / empty languages inconsistently
    if (device.platform === "" && ua) {
      reasons.push("empty_platform");
    }

    // Impossible: no screen but claims browser UA
    if (
      (device.screenWidth === 0 || device.screenHeight === 0) &&
      /Mozilla|Chrome|Safari|Firefox/i.test(ua)
    ) {
      reasons.push("zero_screen");
    }

    // Canvas/WebGL missing on "real" Chromium is suspicious for order bots
    if (/Chrome\//i.test(ua) && !device.canvasFingerprint && !device.webglFingerprint) {
      reasons.push("missing_canvas_webgl");
    }

    // Timezone empty from collector
    if (!device.timezone) {
      reasons.push("missing_timezone");
    }

    // Language mismatch with Accept-Language (soft)
    const acceptLang = headers["accept-language"] || "";
    if (device.language && acceptLang && !acceptLang.toLowerCase().includes(device.language.slice(0, 2).toLowerCase())) {
      reasons.push("language_mismatch");
    }
  } else if (/Mozilla|Chrome|Safari/i.test(ua)) {
    // Browser UA without device payload — likely raw API abuse
    reasons.push("missing_device_payload");
  }

  const isHeadless = reasons.some((r) =>
    ["headless_ua", "webdriver_flag", "zero_screen", "devtools_emulation"].includes(r)
  );
  const isBot =
    reasons.includes("honeypot") ||
    reasons.includes("automation_ua") ||
    isHeadless ||
    (reasons.includes("missing_device_payload") && reasons.includes("missing_canvas_webgl"));

  // Soft signals alone (language_mismatch, missing_timezone) don't hard-flag as bot
  const hardBot =
    isBot ||
    (reasons.filter((r) =>
      ["missing_canvas_webgl", "empty_platform", "missing_timezone", "language_mismatch"].includes(r)
    ).length >= 3);

  return {
    isBot: hardBot,
    isHeadless,
    automationTool,
    reasons,
  };
}

/** Invisible honeypot: bots that fill every field fail */
export function isHoneypotTriggered(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
