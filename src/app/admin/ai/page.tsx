"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface Dashboard {
  orders: Array<{
    orderNumber: string;
    phone: string;
    city: string;
    total: number;
    status: string;
    fraudScore: number;
    isDuplicate: boolean;
    trackingNumber?: string;
    invoiceUrl?: string;
  }>;
  carts: Array<{
    id: string;
    phone?: string;
    subtotal: number;
    recoveryStage: number;
    recovered: boolean;
  }>;
  notifications: Array<{
    id: string;
    channel: string;
    recipient: string;
    status: string;
    body: string;
    templateKey?: string;
  }>;
  stockAlerts: Array<{
    sku: string;
    productName: string;
    currentStock: number;
    suggestedQty: number;
    status: string;
  }>;
  purchaseOrders: Array<{
    poNumber: string;
    sku: string;
    quantity: number;
    status: string;
  }>;
  daily: Array<{
    day: string;
    ordersCount: number;
    revenue: number;
    recoveredCarts: number;
    fakeOrdersBlocked: number;
  }>;
}

export default function AdminAiPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [inventory, setInventory] = useState<{
    bestSellers: Array<{ sku: string; name: string; score: number; reason: string }>;
    narrative: string;
  } | null>(null);
  const [busy, setBusy] = useState("");
  const [supportReply, setSupportReply] = useState("");

  const refresh = async () => {
    const [ordersRes, invRes] = await Promise.all([
      fetch("/api/ai/orders").then((r) => r.json()),
      fetch("/api/ai/inventory").then((r) => r.json()),
    ]);
    setDashboard(ordersRes.dashboard);
    setInventory({ bestSellers: invRes.bestSellers, narrative: invRes.narrative });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial dashboard fetch on mount
    refresh();
  }, []);

  const run = async (label: string, fn: () => Promise<void>) => {
    setBusy(label);
    try {
      await fn();
      await refresh();
    } finally {
      setBusy("");
    }
  };

  if (!dashboard) return <div className="p-8">Loading AI system...</div>;

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display">AI Ecommerce System</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Auto support · cart recovery · fraud · invoices · messaging · analytics · reorder
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={!!busy}
            onClick={() =>
              run("cron", async () => {
                await fetch("/api/ai/cron", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ task: "tick" }),
                });
              })
            }
          >
            {busy === "cron" ? "Running..." : "Run Automation Tick"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!!busy}
            onClick={() =>
              run("recover", async () => {
                await fetch("/api/ai/cart", { method: "PUT" });
              })
            }
          >
            Recover Carts
          </Button>
          <Button
            size="sm"
            variant="gold"
            disabled={!!busy}
            onClick={() =>
              run("demo", async () => {
                await fetch("/api/ai/orders", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    phone: "+212612345678",
                    email: "client@email.ma",
                    firstName: "Sara",
                    city: "Casablanca",
                    address: "Maarif, Rue 12 N°4",
                    items: [{ productId: "prod-astronaut", variantId: "var-astro", quantity: 1 }],
                    locale: "fr",
                  }),
                });
              })
            }
          >
            Simulate Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="AI Orders" value={String(dashboard.orders.length)} />
        <Metric label="Open Carts" value={String(dashboard.carts.filter((c) => !c.recovered).length)} />
        <Metric label="Messages" value={String(dashboard.notifications.length)} />
        <Metric label="Stock Alerts" value={String(dashboard.stockAlerts.length)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Recent AI Orders">
          {dashboard.orders.length === 0 ? (
            <Empty>No automated orders yet — click Simulate Order</Empty>
          ) : (
            dashboard.orders.slice(0, 8).map((o) => (
              <div key={o.orderNumber} className="py-3 border-b last:border-0 flex justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{o.orderNumber}</p>
                  <p className="text-xs text-neutral-500">
                    {o.phone} · {o.city}
                    {o.isDuplicate ? " · DUPLICATE" : ""}
                    {o.fraudScore >= 70 ? ` · fraud ${o.fraudScore}` : ""}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-semibold">{formatPrice(o.total)}</p>
                  <p className="text-xs text-neutral-500">{o.status}</p>
                </div>
              </div>
            ))
          )}
        </Panel>

        <Panel title="Predicted Best Sellers">
          {inventory?.bestSellers?.map((p) => (
            <div key={p.sku} className="py-3 border-b last:border-0 flex justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-neutral-500">{p.reason}</p>
              </div>
              <p className="text-sm font-semibold text-gold">{p.score}</p>
            </div>
          ))}
        </Panel>

        <Panel title="Notifications">
          {dashboard.notifications.slice(0, 8).map((n) => (
            <div key={n.id} className="py-3 border-b last:border-0">
              <div className="flex justify-between gap-2">
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  {n.channel} · {n.status}
                </p>
                <p className="text-xs text-neutral-400">{n.templateKey}</p>
              </div>
              <p className="text-sm mt-1 line-clamp-2">{n.body}</p>
            </div>
          ))}
        </Panel>

        <Panel title="Auto Reorders">
          {dashboard.purchaseOrders.length === 0 ? (
            <Empty>No purchase orders yet</Empty>
          ) : (
            dashboard.purchaseOrders.map((po) => (
              <div key={po.poNumber} className="py-3 border-b last:border-0 flex justify-between">
                <div>
                  <p className="text-sm font-medium">{po.poNumber}</p>
                  <p className="text-xs text-neutral-500">{po.sku}</p>
                </div>
                <div className="text-end">
                  <p className="text-sm">{po.quantity} units</p>
                  <p className="text-xs text-neutral-500">{po.status}</p>
                </div>
              </div>
            ))
          )}
        </Panel>
      </div>

      <Panel title="AI Support Test">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="support-input"
            className="flex-1 h-12 border px-4 text-sm"
            placeholder="Ex: أين طلبي؟ / Où est ma commande ?"
            defaultValue="Bonjour, c'est quoi le délai de livraison à Casablanca ?"
          />
          <Button
            variant="gold"
            disabled={!!busy}
            onClick={() =>
              run("support", async () => {
                const input = document.getElementById("support-input") as HTMLInputElement;
                const res = await fetch("/api/ai/support", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    message: input.value,
                    channel: "web",
                    phone: "+212612345678",
                    locale: "fr",
                  }),
                });
                const data = await res.json();
                setSupportReply(data.reply || data.error || "");
              })
            }
          >
            Ask AI
          </Button>
        </div>
        {supportReply && (
          <div className="mt-4 p-4 bg-neutral-50 text-sm leading-relaxed">{supportReply}</div>
        )}
      </Panel>

      {inventory?.narrative && (
        <Panel title="Inventory Briefing">
          <p className="text-sm text-neutral-600 whitespace-pre-wrap">{inventory.narrative}</p>
        </Panel>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border p-5">
      <p className="text-xs uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border">
      <div className="p-4 border-b">
        <h2 className="font-medium">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-neutral-500">{children}</p>;
}
