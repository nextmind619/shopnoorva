import { aiConfig, isConfigured } from "../config";
import { logIntegration } from "./logger";

export async function triggerN8n(
  workflow: string,
  payload: Record<string, unknown>
): Promise<{ ok: boolean; dryRun?: boolean }> {
  const url = `${aiConfig.n8n.webhookBase}/${workflow}`;

  if (!isConfigured(aiConfig.n8n.webhookBase)) {
    await logIntegration("n8n", workflow, "ok", payload, { dryRun: true });
    return { ok: true, dryRun: true };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "noorva-ai",
        workflow,
        timestamp: new Date().toISOString(),
        ...payload,
      }),
    });
    const data = await res.json().catch(() => ({}));
    await logIntegration("n8n", workflow, res.ok ? "ok" : "error", payload, data);
    return { ok: res.ok };
  } catch (error) {
    await logIntegration("n8n", workflow, "error", payload, {
      error: error instanceof Error ? error.message : "n8n_unreachable",
    });
    return { ok: false };
  }
}
