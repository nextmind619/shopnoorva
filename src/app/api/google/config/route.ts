/**
 * Public Google tracking config for browser bootstrap.
 * Safe to expose — Measurement ID / Ads ID / labels only (no secrets).
 * Reads runtime env so EasyPanel works without rebuild-time NEXT_PUBLIC_*.
 */

import { NextResponse } from "next/server";
import {
  getGa4MeasurementId,
  getGoogleAdsConversionLabel,
  getGoogleAdsId,
  getGoogleAdsSendTo,
  getGtmId,
} from "@/lib/google/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const measurementId = getGa4MeasurementId() || null;
  const adsId = getGoogleAdsId() || null;
  const adsConversionLabel = getGoogleAdsConversionLabel() || null;
  const adsSendTo = getGoogleAdsSendTo() || null;
  const gtmId = getGtmId() || null;

  return NextResponse.json(
    {
      measurementId,
      adsId,
      adsConversionLabel,
      adsSendTo,
      gtmId,
    },
    {
      headers: {
        "Cache-Control": "private, max-age=60",
      },
    },
  );
}
