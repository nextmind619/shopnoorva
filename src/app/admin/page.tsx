"use client";

import { useEffect, useState } from "react";
import { TrendingUp, ShoppingCart, Clock, AlertTriangle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AdminData {
  stats: { totalOrders: number; totalRevenue: number; pendingOrders: number; lowStock: number };
  orders: Array<{ id: string; orderNumber: string; total: number; status: string; shippingAddress: { firstName: string; city: string } }>;
  products: Array<{ id: string; name: string; stock: number; soldCount: number }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminData | null>(null);

  useEffect(() => {
    fetch("/api/admin").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <div className="p-8">Loading...</div>;

  const statCards = [
    { label: "Revenue", value: formatPrice(data.stats.totalRevenue), icon: TrendingUp, color: "text-green-600" },
    { label: "Orders", value: data.stats.totalOrders.toString(), icon: ShoppingCart, color: "text-blue-600" },
    { label: "Pending", value: data.stats.pendingOrders.toString(), icon: Clock, color: "text-orange-600" },
    { label: "Low Stock", value: data.stats.lowStock.toString(), icon: AlertTriangle, color: "text-red-600" },
  ];

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-display mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-500 uppercase tracking-wider">{label}</span>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border">
          <div className="p-4 border-b"><h2 className="font-medium">Recent Orders</h2></div>
          <div className="divide-y">
            {data.orders.length === 0 ? (
              <p className="p-4 text-sm text-neutral-500">No orders yet</p>
            ) : (
              data.orders.map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-neutral-500">{order.shippingAddress.firstName} · {order.shippingAddress.city}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800">{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="bg-white border">
          <div className="p-4 border-b"><h2 className="font-medium">Inventory Alerts</h2></div>
          <div className="divide-y">
            {data.products.filter((p) => p.stock < 100).map((product) => (
              <div key={product.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-neutral-500">{product.soldCount} sold</p>
                </div>
                <span className={`text-sm font-semibold ${product.stock < 50 ? "text-red-600" : "text-orange-600"}`}>{product.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
