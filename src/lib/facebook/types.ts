/**
 * Meta Pixel + Conversions API shared types.
 * Keep this module free of Node/browser-only APIs so both sides can import it.
 */

/** Standard ecommerce + lead events we send to Meta. */
export type FacebookStandardEvent =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase"
  | "Lead"
  | "Contact";

/** Custom data attached to Pixel / CAPI events. */
export interface FacebookCustomData {
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_type?: string;
  content_name?: string;
  content_category?: string;
  contents?: Array<{
    id: string;
    quantity: number;
    item_price?: number;
  }>;
  num_items?: number;
  order_id?: string;
  /** COD / cash on delivery flag for reporting */
  payment_method?: string;
  [key: string]: unknown;
}

/**
 * Raw (unhashed) customer fields collected from the storefront.
 * Server hashes these with SHA-256 before sending to CAPI.
 * Never send the access token from the browser.
 */
export interface FacebookUserDataInput {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
  externalId?: string | null;
  /** Meta browser cookie `_fbp` — do not hash */
  fbp?: string | null;
  /** Meta click cookie `_fbc` / fbclid-derived — do not hash */
  fbc?: string | null;
  /** Client IP — set on the server from the request */
  clientIpAddress?: string | null;
  /** User-Agent — set on the server from the request */
  clientUserAgent?: string | null;
}

export interface FacebookEventPayload {
  eventName: FacebookStandardEvent;
  /** Shared between browser `eventID` and CAPI `event_id` for deduplication */
  eventId: string;
  eventSourceUrl?: string;
  referrerUrl?: string;
  customData?: FacebookCustomData;
  userData?: FacebookUserDataInput;
  /** Unix seconds; defaults to now on the server */
  eventTime?: number;
  actionSource?: "website" | "other" | "phone_call" | "chat" | "email";
}

export interface FacebookCapiResponse {
  ok: boolean;
  eventsReceived?: number;
  fbtraceId?: string;
  error?: string;
  dryRun?: boolean;
}
