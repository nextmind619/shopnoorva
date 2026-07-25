/**
 * Public Facebook / Meta tracking surface for the storefront (client-safe).
 * Server CAPI: import from `@/lib/facebook/conversions` only.
 */

export type {
  FacebookStandardEvent,
  FacebookCustomData,
  FacebookUserDataInput,
  FacebookEventPayload,
  FacebookCapiResponse,
} from "./types";

export {
  getFacebookPixelId,
  isFacebookPixelConfigured,
  FACEBOOK_DEFAULT_CURRENCY,
  FACEBOOK_DEFAULT_COUNTRY,
  FACEBOOK_GRAPH_API_VERSION,
} from "./config";

export {
  generateEventId,
  getFbp,
  getFbc,
  getEventSourceUrl,
  getReferrerUrl,
  trackPixelEvent,
  initPixel,
} from "./pixel";

export {
  fbPageView,
  fbViewContent,
  fbAddToCart,
  fbInitiateCheckout,
  fbPurchase,
  fbLead,
  fbContact,
  getFacebookClickIds,
} from "./events";
