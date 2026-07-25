/**
 * Public Pixel ID for browser bootstrap.
 * Safe to expose — never returns the access token.
 * Reads runtime env (works with EasyPanel without rebuild-time NEXT_PUBLIC_*).
 */

import { NextResponse } from "next/server";
import { getFacebookPixelId } from "@/lib/facebook/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const pixelId = getFacebookPixelId();
  return NextResponse.json(
    { pixelId: pixelId || null },
    {
      headers: {
        // Pixel id rarely changes; short cache is fine, avoid stale empty after env update
        "Cache-Control": "private, max-age=60",
      },
    },
  );
}
