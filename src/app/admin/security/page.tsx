"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Shield } from "lucide-react";

interface Stats {
  blockedToday: number;
  challengedToday: number;
  allowedToday: number;
  blacklistSize: number;
  avgScoreToday: number;
}

interface Log {
  id: string;
  createdAt: string;
  ip: string;
  userAgent: string;
  referer: string;
  pathname: string;
  score: number;
  decision: string;
  reasons: string[];
  flags: string[];
  ipRisk: string;
}

export default function AdminSecurityPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [blacklist, setBlacklist] = useState<
    Array<{ id: string; type: string; value: string; reason: string; hits: number; createdAt: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [manualIp, setManualIp] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/security");
      const data = await res.json();
      setStats(data.stats);
      setLogs(data.logs || []);
      setBlacklist(data.blacklist || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const t = setInterval(() => void refresh(), 30000);
    return () => clearInterval(t);
  }, [refresh]);

  const blockIp = async () => {
    if (!manualIp.trim()) return;
    await fetch("/api/admin/security", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "blacklist", type: "ip", value: manualIp.trim(), reason: "manual" }),
    });
    setManualIp("");
    await refresh();
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6" /> Store Security
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Anti-spy / Ad Library protection. Trust ≥55 allow · 35–54 challenge · &lt;35 block.
            Moroccan shoppers with real ad clicks are protected.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          ["Blocked today", stats?.blockedToday ?? 0],
          ["Challenged", stats?.challengedToday ?? 0],
          ["Allowed (logged)", stats?.allowedToday ?? 0],
          ["Blacklist", stats?.blacklistSize ?? 0],
          ["Avg score", stats?.avgScoreToday ?? 0],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-neutral-200 bg-white p-4">
            <p className="text-xs uppercase text-neutral-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs text-neutral-500">Manual IP blacklist</label>
          <input
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            value={manualIp}
            onChange={(e) => setManualIp(e.target.value)}
            placeholder="1.2.3.4"
          />
        </div>
        <button
          type="button"
          onClick={() => void blockIp()}
          className="rounded-lg bg-black text-white px-4 py-2 text-sm font-medium"
        >
          Block IP
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">IP / Risk</th>
              <th className="px-4 py-3">Path</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Decision</th>
              <th className="px-4 py-3">Reasons</th>
              <th className="px-4 py-3">Referrer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {logs.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-neutral-400">
                  No security events yet.
                </td>
              </tr>
            )}
            {logs.map((log) => (
              <tr key={log.id} className="align-top">
                <td className="px-4 py-3 whitespace-nowrap text-neutral-500">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  <div>{log.ip}</div>
                  <div className="text-neutral-400">{log.ipRisk}</div>
                </td>
                <td className="px-4 py-3 text-xs max-w-[140px] truncate">{log.pathname}</td>
                <td className="px-4 py-3 font-semibold tabular-nums">{log.score}</td>
                <td className="px-4 py-3 uppercase text-xs font-semibold">{log.decision}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {log.reasons.slice(0, 5).map((r) => (
                      <span key={r} className="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px]">
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs max-w-[180px] truncate text-neutral-500">
                  {log.referer || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {blacklist.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Hits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {blacklist.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-3 uppercase text-xs">{b.type}</td>
                  <td className="px-4 py-3 font-mono text-xs">{b.value}</td>
                  <td className="px-4 py-3">{b.reason}</td>
                  <td className="px-4 py-3 tabular-nums">{b.hits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
