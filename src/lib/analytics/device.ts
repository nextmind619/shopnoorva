export type DeviceType = "desktop" | "tablet" | "mobile";

export function parseDevice(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/.test(ua)) return "mobile";
  return "desktop";
}

export function parseBrowser(userAgent: string): "chrome" | "safari" | "edge" | "firefox" | "other" {
  const ua = userAgent.toLowerCase();
  if (/edg\//.test(ua)) return "edge";
  if (/firefox\//.test(ua)) return "firefox";
  if (/chrome\//.test(ua) && !/edg\//.test(ua)) return "chrome";
  if (/safari\//.test(ua) && !/chrome\//.test(ua)) return "safari";
  return "other";
}

export function deviceLabel(device: DeviceType): string {
  return device.charAt(0).toUpperCase() + device.slice(1);
}
