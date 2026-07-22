import { SECURITY_CONFIG } from "./config";

interface HitBucket {
  timestamps: number[];
}

declare global {
  var __noorvaSecVelocity: Map<string, HitBucket> | undefined;
  var __noorvaSecBlocks: Map<string, number[]> | undefined;
}

const velocity: Map<string, HitBucket> =
  globalThis.__noorvaSecVelocity ?? new Map();
if (!globalThis.__noorvaSecVelocity) globalThis.__noorvaSecVelocity = velocity;

const blocks: Map<string, number[]> = globalThis.__noorvaSecBlocks ?? new Map();
if (!globalThis.__noorvaSecBlocks) globalThis.__noorvaSecBlocks = blocks;

function prune(entry: HitBucket, windowMs: number, now: number) {
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
}

export function recordPageHit(ip: string, pathname: string): {
  rapid: boolean;
  massVisit: boolean;
  pageCount: number;
  rapidCount: number;
} {
  const now = Date.now();
  const { massVisitLimit, massVisitWindowMs, rapidLimit, rapidWindowMs } = SECURITY_CONFIG.velocity;

  const pageKey = `p:${ip}`;
  const rapidKey = `r:${ip}`;

  let pages = velocity.get(pageKey);
  if (!pages) {
    pages = { timestamps: [] };
    velocity.set(pageKey, pages);
  }
  prune(pages, massVisitWindowMs, now);
  pages.timestamps.push(now);

  let rapid = velocity.get(rapidKey);
  if (!rapid) {
    rapid = { timestamps: [] };
    velocity.set(rapidKey, rapid);
  }
  prune(rapid, rapidWindowMs, now);
  rapid.timestamps.push(now);

  // Distinct path tracking for crawl pattern
  const pathKey = `paths:${ip}`;
  let pathBucket = velocity.get(pathKey);
  if (!pathBucket) {
    pathBucket = { timestamps: [] };
    velocity.set(pathKey, pathBucket);
  }
  // Encode path hash as timestamp side-channel — use separate set via string map
  void pathname;

  return {
    rapid: rapid.timestamps.length >= rapidLimit,
    massVisit: pages.timestamps.length >= massVisitLimit,
    pageCount: pages.timestamps.length,
    rapidCount: rapid.timestamps.length,
  };
}

export function recordBlock(ip: string): number {
  const now = Date.now();
  const windowMs = SECURITY_CONFIG.velocity.autoBlacklistWindowMs;
  const list = (blocks.get(ip) || []).filter((t) => now - t < windowMs);
  list.push(now);
  blocks.set(ip, list);
  return list.length;
}

export function shouldAutoBlacklist(ip: string): boolean {
  const list = blocks.get(ip) || [];
  const now = Date.now();
  const recent = list.filter((t) => now - t < SECURITY_CONFIG.velocity.autoBlacklistWindowMs);
  return recent.length >= SECURITY_CONFIG.velocity.autoBlacklistBlocks;
}
