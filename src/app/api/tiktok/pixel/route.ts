/**
 * Public TikTok Pixel ID for browser bootstrap.
 * Safe to expose — never returns the access token.
 */

import { NextResponse } from "next/server";
import { getTikTokPixelId } from "@/lib/tiktok/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const pixelId = getTikTokPixelId();
  return NextResponse.json(
    { pixelId: pixelId || null },
    {
      headers: {
        "Cache-Control": "private, max-age=60",
      },
    },
  );
}
