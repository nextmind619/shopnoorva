import { NextRequest, NextResponse } from "next/server";
import { enqueueJob, processJobs } from "@/lib/ai/queue";
import { runAutomationTick, runMonthlyAutomation } from "@/lib/ai/orchestrator";
import { getIntegrationLogs } from "@/lib/ai/integrations/logger";

/**
 * Cron entrypoint for EasyPanel / n8n / system cron.
 * Header: x-cron-secret: CRON_SECRET
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret");
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const task = body.task || "tick";

  if (task === "monthly") {
    const monthly = await runMonthlyAutomation();
    return NextResponse.json({ success: true, monthly });
  }

  if (task === "enqueue") {
    await enqueueJob("automation_tick");
    await enqueueJob("cart_recovery");
    await enqueueJob("sync_shipments");
    await enqueueJob("auto_reorder");
    const jobs = await processJobs(20);
    return NextResponse.json({ success: true, jobs });
  }

  const tick = await runAutomationTick();
  return NextResponse.json({
    success: true,
    tick,
    integrations: getIntegrationLogs(20),
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoints: [
      "POST /api/ai/cron { task: tick|monthly|enqueue }",
      "Requires header x-cron-secret when CRON_SECRET is set",
    ],
  });
}
