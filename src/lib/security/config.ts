/** Visitor protection thresholds — tuned to spare real Moroccan shoppers */

export const SECURITY_CONFIG = {
  /** Trust score bands (higher = safer) */
  bands: {
    allowMin: 55,
    challengeMin: 35,
  },

  weights: {
    base: 50,
    realBrowser: 15,
    challengePassed: 20,
    likelyMoroccan: 15,
    realAdClick: 12,
    missingReferrerSoft: -5,
    suspiciousReferrer: -25,
    facebookAdLibrary: -35,
    datacenter: -30,
    vpn: -18,
    proxy: -22,
    tor: -45,
    botUa: -40,
    headless: -40,
    selenium: -45,
    puppeteer: -45,
    playwright: -45,
    fakeBrowser: -35,
    rapidRequests: -25,
    massVisits: -25,
    blacklisted: -100,
  },

  velocity: {
    /** Page hits before mass-visit flag */
    massVisitLimit: 40,
    massVisitWindowMs: 10 * 60 * 1000,
    /** Requests before rapid flag */
    rapidLimit: 25,
    rapidWindowMs: 60 * 1000,
    /** Auto-blacklist after N blocks */
    autoBlacklistBlocks: 3,
    autoBlacklistWindowMs: 60 * 60 * 1000,
  },

  challenge: {
    cookieName: "nv_vt",
    challengeCookie: "nv_ch",
    ttlSeconds: 60 * 60 * 12, // 12h
    secretEnv: "SECURITY_CHALLENGE_SECRET",
  },

  /** Soft allow-list query params that indicate real paid traffic */
  adClickParams: ["fbclid", "gclid", "ttclid", "msclkid", "utm_source", "utm_campaign"],

  maxLogs: 4000,
} as const;
