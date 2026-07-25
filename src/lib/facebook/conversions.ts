/**
 * Meta Conversions API (CAPI) — server-side only.
 * Access token stays on the server; never import this into Client Components
 * for sending events directly (use /api/facebook/conversions instead).
 */

import {
  FACEBOOK_DEFAULT_CURRENCY,
  FACEBOOK_GRAPH_API_VERSION,
  getFacebookAccessToken,
  getFacebookDatasetId,
  getFacebookTestEventCode,
  isFacebookCapiConfigured,
} from "./config";
import { buildHashedUserData } from "./hash";
import type {
  FacebookCapiResponse,
  FacebookCustomData,
  FacebookEventPayload,
  FacebookUserDataInput,
} from "./types";

function stripUndefined<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out;
}

function buildCustomData(custom?: FacebookCustomData): Record<string, unknown> | undefined {
  if (!custom) return undefined;
  const data = stripUndefined({
    ...custom,
    currency: custom.currency || FACEBOOK_DEFAULT_CURRENCY,
  });
  return Object.keys(data).length ? data : undefined;
}

/**
 * Send one (or more conceptually identical) event(s) to Meta CAPI.
 * Includes SHA-256 hashed PII, IP, UA, fbp/fbc, event_id, referrer, source URL.
 */
export async function sendFacebookConversion(
  payload: FacebookEventPayload,
  options?: {
    /** Extra user context merged on top of payload.userData (e.g. IP from request) */
    requestUserData?: Partial<FacebookUserDataInput>;
  },
): Promise<FacebookCapiResponse> {
  const datasetId = getFacebookDatasetId();
  const accessToken = getFacebookAccessToken();

  if (!isFacebookCapiConfigured()) {
    return { ok: true, dryRun: true, eventsReceived: 0 };
  }

  const userData = buildHashedUserData({
    ...payload.userData,
    ...options?.requestUserData,
  });

  const serverEvent = stripUndefined({
    event_name: payload.eventName,
    event_time: payload.eventTime ?? Math.floor(Date.now() / 1000),
    event_id: payload.eventId,
    action_source: payload.actionSource || "website",
    event_source_url: payload.eventSourceUrl,
    referrer_url: payload.referrerUrl,
    user_data: userData,
    custom_data: buildCustomData(payload.customData),
  });

  const body: Record<string, unknown> = {
    data: [serverEvent],
    // Token in body is fine server-side; never echo it to the client response
    access_token: accessToken,
  };

  const testCode = getFacebookTestEventCode();
  if (testCode) {
    body.test_event_code = testCode;
  }

  const url = `https://graph.facebook.com/${FACEBOOK_GRAPH_API_VERSION}/${datasetId}/events`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // CAPI should not block the order path for long
      signal: AbortSignal.timeout(8000),
    });

    const json = (await res.json().catch(() => ({}))) as {
      events_received?: number;
      fbtrace_id?: string;
      error?: { message?: string };
    };

    if (!res.ok) {
      return {
        ok: false,
        error: json.error?.message || `Meta CAPI HTTP ${res.status}`,
        fbtraceId: json.fbtrace_id,
      };
    }

    return {
      ok: true,
      eventsReceived: json.events_received,
      fbtraceId: json.fbtrace_id,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "meta_capi_failed",
    };
  }
}

/** Convenience wrapper used by the AI orchestrator / order pipeline. */
export async function sendPurchaseConversion(input: {
  eventId: string;
  value: number;
  currency?: string;
  contentIds?: string[];
  orderId?: string;
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  country?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
  referrerUrl?: string;
}): Promise<FacebookCapiResponse> {
  return sendFacebookConversion({
    eventName: "Purchase",
    eventId: input.eventId,
    eventSourceUrl: input.eventSourceUrl,
    referrerUrl: input.referrerUrl,
    customData: {
      value: input.value,
      currency: input.currency || FACEBOOK_DEFAULT_CURRENCY,
      content_ids: input.contentIds,
      content_type: "product",
      order_id: input.orderId,
      payment_method: "cod",
    },
    userData: {
      phone: input.phone,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      city: input.city,
      state: input.state,
      country: input.country || "ma",
      clientIpAddress: input.clientIpAddress,
      clientUserAgent: input.clientUserAgent,
      fbp: input.fbp,
      fbc: input.fbc,
      externalId: input.phone || input.email || undefined,
    },
  });
}
