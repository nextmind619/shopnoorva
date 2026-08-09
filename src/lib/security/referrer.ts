/**
 * Referrer intelligence for competitor / Ad Library spies.
 * Note: Ad Library referrer is NOT always present — missing referrer alone is never a hard block.
 */

const AD_LIBRARY_PATTERNS = [
  /facebook\.com\/ads\/library/i,
  /facebook\.com\/ads\/ad_archive/i,
  /facebook\.com\/adsmanager/i,
  /fb\.com\/ads\/library/i,
  /ads\.facebook\.com/i,
  /business\.facebook\.com\/adsmanager/i,
  /transparency\.fb\.com/i,
  /adlibrary/i,
];

const SUSPICIOUS_REFERRERS = [
  /web\.archive\.org/i,
  /archive\.is/i,
  /archive\.ph/i,
  /similarweb/i,
  /semrush/i,
  /ahrefs/i,
  /spyfu/i,
  /adspy/i,
  /bigspy/i,
  /pipiads/i,
  /foreplay\.co/i,
  /adheart/i,
  /socialpeta/i,
  /milled\.com/i,
  /builtwith/i,
  /wappalyzer/i,
  /screamingfrog/i,
  /httrack/i,
];

const BENIGN_REFERRERS = [
  /facebook\.com/i,
  /instagram\.com/i,
  /l\.instagram\.com/i,
  /l\.facebook\.com/i,
  /lm\.facebook\.com/i,
  /m\.facebook\.com/i,
  /google\./i,
  /bing\./i,
  /tiktok\.com/i,
  /tiktokv\.com/i,
  /snssdk\.com/i,
  /musical\.ly/i,
  /youtube\.com/i,
  /youtu\.be/i,
  /m\.youtube\.com/i,
  /t\.co\//i,
  /whatsapp\.com/i,
  /shopnoorva\.shop/i,
];

/** In-app browsers often strip Referer — detect platform from User-Agent instead. */
const SOCIAL_INAPP_UA =
  /Instagram|FBAN\/|FBAV\/|FB_IAB\/|FB4A|FBIOS|BytedanceWebview|musical_ly|TikTok|YouTube\/|GSA\/|com\.google\.android\.youtube/i;

export interface ReferrerAnalysis {
  missing: boolean;
  suspicious: boolean;
  facebookAdLibrary: boolean;
  competitorTool: boolean;
  benignSocial: boolean;
  reasons: string[];
}

export function analyzeReferrer(referer: string | null | undefined): ReferrerAnalysis {
  const reasons: string[] = [];
  const ref = (referer || "").trim();

  if (!ref) {
    return {
      missing: true,
      suspicious: false,
      facebookAdLibrary: false,
      competitorTool: false,
      benignSocial: false,
      reasons: ["referrer_missing"],
    };
  }

  let facebookAdLibrary = false;
  let competitorTool = false;
  let benignSocial = false;

  for (const p of AD_LIBRARY_PATTERNS) {
    if (p.test(ref)) {
      facebookAdLibrary = true;
      reasons.push("facebook_ad_library");
      break;
    }
  }

  for (const p of SUSPICIOUS_REFERRERS) {
    if (p.test(ref)) {
      competitorTool = true;
      reasons.push("competitor_referrer");
      break;
    }
  }

  if (!facebookAdLibrary && !competitorTool) {
    for (const p of BENIGN_REFERRERS) {
      if (p.test(ref)) {
        benignSocial = true;
        reasons.push("benign_referrer");
        break;
      }
    }
  }

  return {
    missing: false,
    suspicious: facebookAdLibrary || competitorTool,
    facebookAdLibrary,
    competitorTool,
    benignSocial,
    reasons,
  };
}

/** Real paid-click signals (fbclid / ttclid etc.) — Meta + TikTok + Google ads */
export function detectRealAdClick(searchParams: URLSearchParams): boolean {
  const keys = ["fbclid", "gclid", "ttclid", "msclkid"];
  if (keys.some((k) => searchParams.has(k))) return true;
  const utm = (searchParams.get("utm_source") || "").toLowerCase();
  if (
    [
      "facebook",
      "fb",
      "instagram",
      "ig",
      "tiktok",
      "tt",
      "meta",
      "bytedance",
      "youtube",
      "yt",
    ].includes(utm)
  ) {
    return true;
  }
  return false;
}

/** Instagram / YouTube / TikTok / Facebook in-app WebViews (Referer often empty). */
export function detectSocialInAppBrowser(userAgent: string): boolean {
  return SOCIAL_INAPP_UA.test(userAgent || "");
}

/** Organic or paid traffic from social platforms (referrer, in-app UA, or ad params). */
export function detectSocialTraffic(input: {
  referer?: string | null;
  userAgent?: string;
  searchParams?: URLSearchParams;
}): boolean {
  if (detectRealAdClick(input.searchParams || new URLSearchParams())) return true;
  if (detectSocialInAppBrowser(input.userAgent || "")) return true;
  return analyzeReferrer(input.referer).benignSocial;
}
