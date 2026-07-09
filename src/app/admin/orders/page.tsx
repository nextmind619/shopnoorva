"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Array<{ id: string; orderNumber: string; total: number; status: string; paymentMethod: string; createdAt: string; shippingAddress: { firstName: string; lastName: string; phone: string; city: string; address: string } }>>([]);

  useEffect(() => {
    fetch("/api/admin").then((r) => r.json()).then((d) => setOrders(d.orders || []));
  }, []);

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-display mb-8">Orders</h1>
      <div className="bg-white border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-neutral-50">
            <tr>
              <th className="text-start p-4 font-medium">Order</th>
              <th className="text-start p-4 font-medium">Customer</th>
              <th className="text-start p-4 font-medium">City</th>
              <th className="text-start p-4 font-medium">Payment</th>
              <th className="text-start p-4 font-medium">Total</th>
              <th className="text-start p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50">
                <td className="p-4 font-medium">{order.orderNumber}</td>
                <td className="p-4">{order.shippingAddress.firstName} {order.shippingAddress.lastName}<br /><span className="text-xs text-neutral-500">{order.shippingAddress.phone}</span></td>
                <td className="p-4">{order.shippingAddress.city}</td>
                <td className="p-4 uppercase text-xs">{order.paymentMethod}</td>
                <td className="p-4 font-semibold">{formatPrice(order.total)}</td>
                <td className="p-4"><span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800">{order.status}</span></td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-neutral-500">No orders yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
