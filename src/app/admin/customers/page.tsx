"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Array<{ id: string; firstName: string; lastName: string; email: string; phone: string; city: string; totalOrders: number; totalSpent: number }>>([]);

  useEffect(() => {
    fetch("/api/admin").then((r) => r.json()).then((d) => setCustomers(d.customers || []));
  }, []);

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-display mb-8">Customers</h1>
      <div className="bg-white border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-neutral-50">
            <tr>
              <th className="text-start p-4 font-medium">Name</th>
              <th className="text-start p-4 font-medium">Contact</th>
              <th className="text-start p-4 font-medium">City</th>
              <th className="text-start p-4 font-medium">Orders</th>
              <th className="text-start p-4 font-medium">Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50">
                <td className="p-4 font-medium">{c.firstName} {c.lastName}</td>
                <td className="p-4"><span className="block">{c.email}</span><span className="text-xs text-neutral-500">{c.phone}</span></td>
                <td className="p-4">{c.city}</td>
                <td className="p-4">{c.totalOrders}</td>
                <td className="p-4 font-semibold">{formatPrice(c.totalSpent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
