import type { DeviceSignals } from "./types";

export interface DeviceAnalysis {
  realBrowser: boolean;
  consistent: boolean;
  reasons: string[];
  summary: Required<
    Pick<
      DeviceSignals,
      | "timezone"
      | "language"
      | "screenResolution"
      | "platform"
      | "userAgent"
      | "touchSupport"
      | "canvasFingerprint"
      | "webglFingerprint"
    >
  > & {
    hardwareConcurrency: number;
    deviceMemory: number;
  };
}

const REAL_BROWSER_UA = /Mozilla\/5\.0.*(Chrome|Firefox|Safari|Edg|OPR|SamsungBrowser|Mobile)/i;

/**
 * Collect & evaluate device signals for fraud scoring.
 */
export function analyzeDevice(
  device: DeviceSignals | undefined,
  fallbackUa?: string
): DeviceAnalysis {
  const reasons: string[] = [];
  const ua = device?.userAgent || fallbackUa || "";

  const summary = {
    timezone: device?.timezone || "",
    language: device?.language || "",
    screenResolution:
      device?.screenResolution ||
      (device?.screenWidth && device?.screenHeight
        ? `${device.screenWidth}x${device.screenHeight}`
        : ""),
    platform: device?.platform || "",
    userAgent: ua,
    touchSupport: Boolean(device?.touchSupport || (device?.maxTouchPoints || 0) > 0),
    canvasFingerprint: device?.canvasFingerprint || "",
    webglFingerprint: device?.webglFingerprint || "",
    hardwareConcurrency: device?.hardwareConcurrency || 0,
    deviceMemory: device?.deviceMemory || 0,
  };

  const realBrowser = REAL_BROWSER_UA.test(ua) && !/HeadlessChrome|PhantomJS/i.test(ua);
  if (!realBrowser) reasons.push("unreal_browser_ua");

  if (!summary.timezone) reasons.push("no_timezone");
  if (!summary.language) reasons.push("no_language");
  if (!summary.screenResolution) reasons.push("no_screen");
  if (!summary.platform) reasons.push("no_platform");
  if (!summary.canvasFingerprint) reasons.push("no_canvas");
  if (!summary.webglFingerprint) reasons.push("no_webgl");

  // Consistency: mobile UA should often have touch
  const claimsMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  if (claimsMobile && !summary.touchSupport) {
    reasons.push("mobile_without_touch");
  }

  // Desktop with huge touch points is odd
  if (!claimsMobile && (device?.maxTouchPoints || 0) > 5) {
    reasons.push("desktop_many_touchpoints");
  }

  // Morocco-ish timezone preference (soft)
  if (summary.timezone && !/Africa\/Casablanca|UTC|GMT/i.test(summary.timezone)) {
    reasons.push("foreign_timezone");
  }

  const consistent =
    reasons.filter((r) =>
      ["mobile_without_touch", "desktop_many_touchpoints", "no_canvas", "no_webgl", "no_screen"].includes(r)
    ).length <= 1;

  return { realBrowser, consistent, reasons, summary };
}
