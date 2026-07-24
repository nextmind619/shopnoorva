/** Scoring weights and operational thresholds for Moroccan COD anti-fraud */

export const FRAUD_CONFIG = {
  /** Max orders per window for IP / phone / fingerprint / device */
  rateLimit: {
    maxOrders: 2,
    windowMs: 30 * 60 * 1000, // 30 minutes
  },

  /** Trust score bands (higher = safer) */
  scoreBands: {
    acceptMin: 80,
    reviewMin: 50,
  },

  /** Positive / negative score deltas */
  weights: {
    validPhone: 20,
    normalIp: 20,
    residentialIp: 15,
    realBrowser: 10,
    humanSignals: 10,
    deviceConsistency: 8,
    addressQuality: 7,
    vpn: -25,
    proxy: -30,
    tor: -50,
    datacenter: -40,
    repeatedPhone: -40,
    repeatedFingerprint: -40,
    repeatedDevice: -35,
    fastMultipleOrders: -30,
    velocitySuspicious: -25,
    botDetected: -50,
    headless: -45,
    honeypotTriggered: -60,
    formTooFast: -20,
    blacklisted: -100,
    invalidPhone: -50,
    fakePhonePattern: -45,
  },

  velocity: {
    /** Lookback for name/phone/address/fingerprint abuse */
    windowMs: 24 * 60 * 60 * 1000,
    maxDistinctNamesPerIp: 2,
    maxDistinctNamesPerPhone: 2,
    maxDistinctPhonesPerAddress: 3,
    maxDistinctPhonesPerFingerprint: 2,
  },

  blacklist: {
    /**
     * Auto-blacklist when rejecting for these reason keys.
     * Note: honeypot alone is intentionally excluded — browser autofill
     * commonly fills hidden fields and would permanently ban real buyers.
     */
    autoReasons: [
      "blacklisted",
      "headless_browser",
      "fake_phone_pattern",
      "tor",
      "repeated_phone_abuse",
      "repeated_fingerprint_abuse",
    ],
  },

  /** Form fill under this many ms is suspicious */
  minFormFillMs: 2500,

  /** Soft max log retention in memory */
  maxLogs: 5000,
  maxAttempts: 10000,
} as const;

export type FraudConfig = typeof FRAUD_CONFIG;
