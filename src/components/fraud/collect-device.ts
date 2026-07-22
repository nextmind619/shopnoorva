/**
 * Client-side device & browser fingerprint collector.
 * Runs in the browser only — no external scripts.
 */

export interface CollectedDeviceSignals {
  timezone: string;
  language: string;
  languages: string[];
  screenResolution: string;
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  platform: string;
  userAgent: string;
  touchSupport: boolean;
  maxTouchPoints: number;
  canvasFingerprint: string;
  webglFingerprint: string;
  webglVendor: string;
  webglRenderer: string;
  hardwareConcurrency: number;
  deviceMemory: number;
  cookieEnabled: boolean;
  doNotTrack: string | null;
  vendor: string;
  fingerprint: string;
  deviceId: string;
  webdriver: boolean;
  collectedAt: number;
}

const DEVICE_ID_KEY = "nv_device_id";

function ensureDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (id && /^[a-zA-Z0-9_-]{8,64}$/.test(id)) return id;
    id = `d_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
    return id;
  } catch {
    return `d_ephemeral_${Date.now().toString(36)}`;
  }
}

function canvasHash(): string {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 60;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(0, 0, 120, 60);
    ctx.fillStyle = "#069";
    ctx.fillText("NOORVA-COD-FP", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("NOORVA-COD-FP", 4, 32);
    const data = canvas.toDataURL();
    return simpleHash(data);
  } catch {
    return "";
  }
}

function webglInfo(): { hash: string; vendor: string; renderer: string } {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return { hash: "", vendor: "", renderer: "" };
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const vendor = dbg ? String(gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || "") : "";
    const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "") : "";
    const params = [
      gl.getParameter(gl.VERSION),
      gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      vendor,
      renderer,
    ].join("~");
    return { hash: simpleHash(params), vendor, renderer };
  } catch {
    return { hash: "", vendor: "", renderer: "" };
  }
}

function simpleHash(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export async function collectDeviceSignals(): Promise<CollectedDeviceSignals> {
  const webgl = webglInfo();
  const canvasFingerprint = canvasHash();
  const deviceId = ensureDeviceId();
  const nav = typeof navigator !== "undefined" ? navigator : ({} as Navigator);
  const scr = typeof screen !== "undefined" ? screen : ({ width: 0, height: 0, colorDepth: 0 } as Screen);

  const timezone = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch {
      return "";
    }
  })();

  const payload = {
    timezone,
    language: nav.language || "",
    languages: Array.from(nav.languages || []),
    screenResolution: `${scr.width}x${scr.height}`,
    screenWidth: scr.width || 0,
    screenHeight: scr.height || 0,
    colorDepth: scr.colorDepth || 0,
    platform: nav.platform || "",
    userAgent: nav.userAgent || "",
    touchSupport: "ontouchstart" in window || (nav.maxTouchPoints || 0) > 0,
    maxTouchPoints: nav.maxTouchPoints || 0,
    canvasFingerprint,
    webglFingerprint: webgl.hash,
    webglVendor: webgl.vendor,
    webglRenderer: webgl.renderer,
    hardwareConcurrency: nav.hardwareConcurrency || 0,
    deviceMemory: Number((nav as Navigator & { deviceMemory?: number }).deviceMemory || 0),
    cookieEnabled: Boolean(nav.cookieEnabled),
    doNotTrack: nav.doNotTrack ?? null,
    vendor: nav.vendor || "",
    deviceId,
    webdriver: Boolean((nav as Navigator & { webdriver?: boolean }).webdriver),
    collectedAt: Date.now(),
  };

  const fingerprint = simpleHash(
    [
      payload.canvasFingerprint,
      payload.webglFingerprint,
      payload.platform,
      payload.screenResolution,
      payload.timezone,
      payload.language,
      payload.hardwareConcurrency,
      payload.deviceId,
    ].join("|")
  );

  return { ...payload, fingerprint };
}
