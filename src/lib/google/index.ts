export {
  getGa4MeasurementId,
  getGoogleAdsId,
  getGoogleAdsConversionLabel,
  getGoogleAdsCustomerId,
  getGoogleAdsSendTo,
  getGtmId,
  isGa4Configured,
  isGoogleAdsConversionConfigured,
  isGtmConfigured,
  GOOGLE_DEFAULT_CURRENCY,
  isGoogleAnalyticsDebug,
} from "./config";

export {
  trackViewItem,
  trackAddToCart,
  trackBeginCheckout,
  trackPurchase,
  captureMarketingAttribution,
  getStoredAttribution,
  isGoogleAttribution,
} from "./events";

export type { GaItemInput, TrackPurchaseInput } from "./events";
export type { MarketingAttribution } from "./attribution";
export { platformFromAttribution } from "./attribution";
export { setGoogleConsentDefaults, updateGoogleConsent } from "./consent";
export type { GoogleConsentSettings, GoogleConsentState } from "./consent";
