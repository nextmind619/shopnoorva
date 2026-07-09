export interface IntegrationLog {
  id: string;
  provider: string;
  action: string;
  status: "ok" | "error";
  request?: unknown;
  response?: unknown;
  createdAt: string;
}

const logs: IntegrationLog[] = [];

export async function logIntegration(
  provider: string,
  action: string,
  status: "ok" | "error",
  request?: unknown,
  response?: unknown
): Promise<void> {
  logs.push({
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    provider,
    action,
    status,
    request,
    response,
    createdAt: new Date().toISOString(),
  });
  // Keep memory bounded
  if (logs.length > 500) logs.splice(0, logs.length - 500);
}

export function getIntegrationLogs(limit = 50): IntegrationLog[] {
  return logs.slice(-limit).reverse();
}
