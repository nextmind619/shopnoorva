"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ShieldAlert,
  Ban,
  Phone,
  Fingerprint,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Monitor,
} from "lucide-react";

interface FraudStats {
  todayFakeAttempts: number;
  blockedIps: number;
  blockedPhones: number;
  blockedFingerprints: number;
  blockedDevices: number;
  highRiskOrders: number;
  acceptedOrders: number;
  rejectedOrders: number;
  reviewOrders: number;
  avgScoreToday: number;
  avgDurationMs: number;
}

interface FraudLog {
  id: string;
  createdAt: string;
  phone: string;
  phoneNormalized: string;
  fullName: string;
  address: string;
  ip: string;
  fingerprint: string;
  deviceId: string;
  score: number;
  decision: "accept" | "review" | "reject";
  reasons: string[];
  flags: string[];
  ipRisk: string;
  durationMs: number;
}

interface BlacklistEntry {
  id: string;
  type: string;
  value: string;
  reason: string;
  createdAt: string;
  source: string;
  hits: number;
}

function decisionBadge(decision: string) {
  if (decision === "accept")
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (decision === "review")
    return "bg-amber-100 text-amber-900 border-amber-200";
  return "bg-red-100 text-red-800 border-red-200";
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-700";
  if (score >= 50) return "text-amber-700";
  return "text-red-700";
}

export default function AdminFraudPage() {
  const [stats, setStats] = useState<FraudStats | null>(null);
  const [logs, setLogs] = useState<FraudLog[]>([]);
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"logs" | "blacklist">("logs");
  const [manual, setManual] = useState({ type: "phone", value: "", reason: "" });

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/fraud?limit=150");
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

  const addBlacklist = async () => {
    if (!manual.value.trim()) return;
    await fetch("/api/admin/fraud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "blacklist",
        type: manual.type,
        value: manual.value.trim(),
        reason: manual.reason.trim() || "manual",
      }),
    });
    setManual({ type: manual.type, value: "", reason: "" });
    await refresh();
  };

  const removeBlacklist = async (id: string) => {
    await fetch("/api/admin/fraud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unblacklist", id }),
    });
    await refresh();
  };

  const cards = [
    {
      label: "Today's fake attempts",
      value: stats?.todayFakeAttempts ?? 0,
      icon: ShieldAlert,
      tone: "text-red-600 bg-red-50",
    },
    {
      label: "Blocked IPs",
      value: stats?.blockedIps ?? 0,
      icon: Ban,
      tone: "text-neutral-800 bg-neutral-100",
    },
    {
      label: "Blocked Phones",
      value: stats?.blockedPhones ?? 0,
      icon: Phone,
      tone: "text-violet-700 bg-violet-50",
    },
    {
      label: "Blocked Fingerprints",
      value: stats?.blockedFingerprints ?? 0,
      icon: Fingerprint,
      tone: "text-sky-700 bg-sky-50",
    },
    {
      label: "High Risk",
      value: stats?.highRiskOrders ?? 0,
      icon: Monitor,
      tone: "text-orange-700 bg-orange-50",
    },
    {
      label: "Accepted",
      value: stats?.acceptedOrders ?? 0,
      icon: CheckCircle2,
      tone: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "Rejected",
      value: stats?.rejectedOrders ?? 0,
      icon: XCircle,
      tone: "text-red-700 bg-red-50",
    },
    {
      label: "Review",
      value: stats?.reviewOrders ?? 0,
      icon: Eye,
      tone: "text-amber-700 bg-amber-50",
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Fraud Dashboard
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Anti Fake Orders — Moroccan COD. Score 80–100 accept · 50–79 review · 0–49 reject.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{label}</p>
              <span className={`rounded-md p-1.5 ${tone}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-neutral-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
        <span>
          Avg score today:{" "}
          <strong className={scoreColor(stats?.avgScoreToday ?? 0)}>
            {stats?.avgScoreToday ?? 0}
          </strong>
        </span>
        <span>
          Avg check latency: <strong>{stats?.avgDurationMs ?? 0} ms</strong>
        </span>
        <span>
          Blocked devices: <strong>{stats?.blockedDevices ?? 0}</strong>
        </span>
      </div>

      <div className="flex gap-2 border-b border-neutral-200">
        {(["logs", "blacklist"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === t
                ? "border-black text-black"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {t === "logs" ? "Fraud Logs" : "Blacklist"}
          </button>
        ))}
      </div>

      {tab === "logs" && (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone / IP</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Decision</th>
                <th className="px-4 py-3">Reasons</th>
                <th className="px-4 py-3">ms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {logs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-neutral-400">
                    No fraud checks yet. Submit an order to see logs.
                  </td>
                </tr>
              )}
              {logs.map((log) => (
                <tr key={log.id} className="align-top hover:bg-neutral-50/80">
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{log.fullName || "—"}</div>
                    <div className="text-xs text-neutral-400 max-w-[180px] truncate">{log.address}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    <div>{log.phoneNormalized || log.phone}</div>
                    <div className="text-neutral-400">{log.ip}</div>
                    <div className="text-neutral-400">IP: {log.ipRisk}</div>
                  </td>
                  <td className={`px-4 py-3 text-lg font-semibold tabular-nums ${scoreColor(log.score)}`}>
                    {log.score}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${decisionBadge(log.decision)}`}
                    >
                      {log.decision}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(log.reasons.length ? log.reasons : log.flags).slice(0, 6).map((r) => (
                        <span
                          key={r}
                          className="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] text-neutral-700"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-neutral-500">{log.durationMs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "blacklist" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs text-neutral-500">Type</label>
              <select
                className="mt-1 block rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                value={manual.type}
                onChange={(e) => setManual((m) => ({ ...m, type: e.target.value }))}
              >
                <option value="phone">Phone</option>
                <option value="ip">IP</option>
                <option value="fingerprint">Fingerprint</option>
                <option value="device">Device</option>
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="text-xs text-neutral-500">Value</label>
              <input
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                value={manual.value}
                onChange={(e) => setManual((m) => ({ ...m, value: e.target.value }))}
                placeholder="06XXXXXXXX / IP / hash"
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="text-xs text-neutral-500">Reason</label>
              <input
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                value={manual.reason}
                onChange={(e) => setManual((m) => ({ ...m, reason: e.target.value }))}
                placeholder="manual block"
              />
            </div>
            <button
              type="button"
              onClick={() => void addBlacklist()}
              className="rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800"
            >
              Add to blacklist
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Hits</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {blacklist.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-neutral-400">
                      Blacklist is empty.
                    </td>
                  </tr>
                )}
                {blacklist.map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 font-medium uppercase text-xs">{b.type}</td>
                    <td className="px-4 py-3 font-mono text-xs">{b.value}</td>
                    <td className="px-4 py-3 text-neutral-600">{b.reason}</td>
                    <td className="px-4 py-3">{b.source}</td>
                    <td className="px-4 py-3 tabular-nums">{b.hits}</td>
                    <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                      {new Date(b.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => void removeBlacklist(b.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
