import { aiConfig } from "./config";
import { store, uid, type AiJob } from "./memory-store";
import { runAutomationTick, runMonthlyAutomation } from "./orchestrator";
import { processAbandonedCarts } from "./cart-recovery";
import { syncPendingShipments } from "./shipments";
import { generateDailyAnalytics, generateMonthlyAnalytics } from "./analytics";
import { autoReorderProducts } from "./inventory";
import { logIntegration } from "./integrations/logger";

let redis: import("ioredis").default | null = null;

async function getRedis() {
  if (redis) return redis;
  try {
    const Redis = (await import("ioredis")).default;
    redis = new Redis(aiConfig.redis.url, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      connectTimeout: 1200,
    });
    await redis.connect();
    return redis;
  } catch {
    redis = null;
    return null;
  }
}

export async function enqueueJob(
  jobType: string,
  payload: Record<string, unknown> = {},
  delayMs = 0
): Promise<AiJob> {
  const job: AiJob = {
    id: uid("job"),
    jobType,
    payload,
    status: "queued",
    attempts: 0,
    runAt: new Date(Date.now() + delayMs).toISOString(),
    createdAt: new Date().toISOString(),
  };
  store.jobs.push(job);

  const r = await getRedis();
  if (r) {
    await r.lpush("noorva:jobs", JSON.stringify(job));
    await logIntegration("redis", "enqueue", "ok", { jobType, id: job.id });
  }

  return job;
}

export async function processJobs(limit = 10): Promise<AiJob[]> {
  const due = store.jobs
    .filter((j) => j.status === "queued" && new Date(j.runAt).getTime() <= Date.now())
    .slice(0, limit);

  for (const job of due) {
    job.status = "running";
    job.attempts += 1;
    try {
      await executeJob(job);
      job.status = "done";
      job.finishedAt = new Date().toISOString();
    } catch (error) {
      job.status = job.attempts >= 3 ? "failed" : "queued";
      job.lastError = error instanceof Error ? error.message : "job_failed";
      if (job.status === "queued") {
        job.runAt = new Date(Date.now() + job.attempts * 60000).toISOString();
      }
    }
  }

  return due;
}

async function executeJob(job: AiJob): Promise<void> {
  switch (job.jobType) {
    case "automation_tick":
      await runAutomationTick();
      break;
    case "cart_recovery":
      await processAbandonedCarts();
      break;
    case "sync_shipments":
      await syncPendingShipments();
      break;
    case "daily_analytics":
      await generateDailyAnalytics();
      break;
    case "monthly_analytics":
      await generateMonthlyAnalytics();
      break;
    case "auto_reorder":
      await autoReorderProducts();
      break;
    case "monthly_automation":
      await runMonthlyAutomation();
      break;
    default:
      throw new Error(`Unknown job type: ${job.jobType}`);
  }
}
