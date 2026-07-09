"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Array<{ id: string; name: string; stock: number; price: number; soldCount: number }>>([]);

  useEffect(() => {
    fetch("/api/admin").then((r) => r.json()).then((d) => setProducts(d.products || []));
  }, []);

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-display mb-8">Products</h1>
      <div className="bg-white border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-neutral-50">
            <tr>
              <th className="text-start p-4 font-medium">Product</th>
              <th className="text-start p-4 font-medium">Price</th>
              <th className="text-start p-4 font-medium">Stock</th>
              <th className="text-start p-4 font-medium">Sold</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">{formatPrice(p.price)}</td>
                <td className="p-4"><span className={p.stock < 50 ? "text-red-600 font-semibold" : ""}>{p.stock}</span></td>
                <td className="p-4">{p.soldCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
