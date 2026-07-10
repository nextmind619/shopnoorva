import { Pool } from "pg";
import { aiConfig, isConfigured } from "@/lib/ai/config";

declare global {
  var __noorvaPgPool: Pool | undefined;
}

/**
 * Real Postgres persistence, guarded by DATABASE_URL. When not configured,
 * callers should fall back to in-memory storage (see lib/ai/memory-store.ts)
 * so the whole order pipeline keeps working locally without infra.
 */
export function isDbConfigured(): boolean {
  return isConfigured(process.env.DATABASE_URL || "");
}

export function getPool(): Pool {
  if (!globalThis.__noorvaPgPool) {
    globalThis.__noorvaPgPool = new Pool({
      connectionString: aiConfig.postgres.url,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return globalThis.__noorvaPgPool;
}
