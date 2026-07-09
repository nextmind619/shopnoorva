import { NextRequest, NextResponse } from "next/server";
import { generateDailyAnalytics, generateMonthlyAnalytics } from "@/lib/ai/analytics";
import { store } from "@/lib/ai/memory-store";

export async function GET(request: NextRequest) {
  const period = request.nextUrl.searchParams.get("period") || "daily";
  if (period === "monthly") {
    const monthly = await generateMonthlyAnalytics();
    return NextResponse.json({ success: true, ...monthly });
  }
  const daily = await generateDailyAnalytics();
  return NextResponse.json({
    success: true,
    ...daily,
    history: store.daily.slice(-30),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  if (body.period === "monthly") {
    return NextResponse.json({ success: true, ...(await generateMonthlyAnalytics()) });
  }
  return NextResponse.json({ success: true, ...(await generateDailyAnalytics()) });
}
