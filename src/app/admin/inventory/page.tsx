"use client";

import { useEffect, useState } from "react";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Array<{ id: string; name: string; stock: number; soldCount: number }>>([]);

  useEffect(() => {
    fetch("/api/admin").then((r) => r.json()).then((d) => setProducts(d.products || []));
  }, []);

  const lowStock = products.filter((p) => p.stock < 100);
  const outOfStock = products.filter((p) => p.stock === 0);

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-display mb-8">Inventory</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border p-5"><p className="text-xs text-neutral-500 uppercase">Total SKUs</p><p className="text-2xl font-semibold mt-1">{products.length}</p></div>
        <div className="bg-white border p-5"><p className="text-xs text-neutral-500 uppercase">Low Stock</p><p className="text-2xl font-semibold mt-1 text-orange-600">{lowStock.length}</p></div>
        <div className="bg-white border p-5"><p className="text-xs text-neutral-500 uppercase">Out of Stock</p><p className="text-2xl font-semibold mt-1 text-red-600">{outOfStock.length}</p></div>
      </div>
      <div className="bg-white border">
        <div className="p-4 border-b"><h2 className="font-medium">Stock Levels</h2></div>
        <div className="divide-y">
          {products.map((p) => (
            <div key={p.id} className="p-4 flex items-center gap-4">
              <div className="flex-1"><p className="text-sm font-medium">{p.name}</p></div>
              <div className="w-48 bg-neutral-100 h-2 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${p.stock < 50 ? "bg-red-500" : p.stock < 200 ? "bg-orange-400" : "bg-green-500"}`} style={{ width: `${Math.min(100, (p.stock / 1000) * 100)}%` }} />
              </div>
              <span className="text-sm font-semibold w-16 text-end">{p.stock}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
