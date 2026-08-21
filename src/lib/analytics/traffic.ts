const SOURCE_COLORS: Record<string, string> = {
  facebook: "#1877F2",
  instagram: "#E4405F",
  tiktok: "#000000",
  google: "#4285F4",
  direct: "#6B7280",
  organic: "#10B981",
  email: "#8B5CF6",
  other: "#94A3B8",
};

export function classifyTrafficSource(referer: string, searchParams?: URLSearchParams): string {
  const ref = (referer || "").toLowerCase();
  const utm = (searchParams?.get("utm_source") || "").toLowerCase();
  const gclid = (searchParams?.get("gclid") || "").toLowerCase();
  const combined = `${ref} ${utm} ${gclid}`;

  if (/fbclid|facebook|fb\.com|fb\.me|m\.facebook/.test(combined)) return "facebook";
  if (/instagram|l\.instagram/.test(combined)) return "instagram";
  if (/tiktok|ttclid|bytedance|musical_ly/.test(combined)) return "tiktok";
  if (/gclid|google\.|googleads|youtube|adwords|\byt\b/.test(combined)) return "google";
  if (utm === "google" || utm === "youtube" || utm === "yt") return "google";
  if (/email|mail\.|newsletter|resend/.test(combined)) return "email";
  if (!ref && !utm && !gclid) return "direct";
  if (/bing|duckduck|yahoo|search/.test(combined)) return "organic";
  return "other";
}

export function trafficSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    google: "Google",
    direct: "Direct",
    organic: "Organic",
    email: "Email",
    other: "Other",
  };
  return labels[source] ?? source;
}

export function trafficSourceColor(source: string): string {
  return SOURCE_COLORS[source] ?? SOURCE_COLORS.other;
}

export function platformFromSource(source: string): "facebook" | "instagram" | "tiktok" | "google" | null {
  if (source === "facebook" || source === "instagram") return source;
  if (source === "tiktok") return "tiktok";
  if (source === "google") return "google";
  return null;
}
