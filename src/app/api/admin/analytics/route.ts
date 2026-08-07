import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsDashboard } from "@/lib/analytics/service";
import type { DatePreset } from "@/types/analytics";

const PRESETS = new Set<DatePreset>(["today", "yesterday", "7d", "30d", "90d", "custom"]);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const presetParam = searchParams.get("preset") || "7d";
  const preset = PRESETS.has(presetParam as DatePreset) ? (presetParam as DatePreset) : "7d";
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const data = getAnalyticsDashboard(preset, from, to);
  return NextResponse.json({ success: true, data });
}
