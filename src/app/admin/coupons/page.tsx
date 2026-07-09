"use client";

import { useEffect, useState } from "react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Array<{ id: string; code: string; type: string; value: number; minOrder: number; usedCount: number; maxUses: number; active: boolean; expiresAt: string }>>([]);

  useEffect(() => {
    fetch("/api/admin").then((r) => r.json()).then((d) => setCoupons(d.coupons || []));
  }, []);

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-display mb-8">Coupons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono font-bold text-lg">{c.code}</span>
              <span className={`text-xs px-2 py-1 ${c.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{c.active ? "Active" : "Inactive"}</span>
            </div>
            <p className="text-sm text-neutral-600">{c.type === "percentage" ? `${c.value}% off` : `${c.value} MAD off`}</p>
            <p className="text-xs text-neutral-500 mt-2">Min order: {c.minOrder} MAD</p>
            <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
              <span>Used: {c.usedCount}/{c.maxUses}</span>
              <span>Expires: {c.expiresAt}</span>
            </div>
            <div className="mt-2 w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full" style={{ width: `${(c.usedCount / c.maxUses) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
