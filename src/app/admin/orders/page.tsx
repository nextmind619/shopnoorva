"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Phone, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AdminOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: Array<{ name: string; quantity: number }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
  };
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-800",
  review: "bg-amber-100 text-amber-800",
  pending: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ar-MA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch-on-mount, refreshed every 30s
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display">الطلبات</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {orders.length} طلب · تحديث تلقائي كل 30 ثانية
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-neutral-50 disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          تحديث
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="border-b bg-neutral-50">
              <tr>
                <th className="text-start p-4 font-medium">رقم الطلب</th>
                <th className="text-start p-4 font-medium">التاريخ</th>
                <th className="text-start p-4 font-medium">العميل</th>
                <th className="text-start p-4 font-medium">المنتج</th>
                <th className="text-start p-4 font-medium">العنوان</th>
                <th className="text-start p-4 font-medium">الدفع</th>
                <th className="text-start p-4 font-medium">المجموع</th>
                <th className="text-start p-4 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50 align-top">
                  <td className="p-4 font-semibold whitespace-nowrap">{order.orderNumber}</td>
                  <td className="p-4 text-neutral-500 whitespace-nowrap text-xs">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <a
                      href={`tel:${order.shippingAddress.phone}`}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                      dir="ltr"
                    >
                      <Phone className="h-3 w-3" />
                      {order.shippingAddress.phone}
                    </a>
                  </td>
                  <td className="p-4">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-xs leading-relaxed">
                        {item.name} × {item.quantity}
                      </p>
                    ))}
                  </td>
                  <td className="p-4 max-w-[200px]">
                    <p className="text-xs text-neutral-600 flex items-start gap-1">
                      <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                      <span>
                        {order.shippingAddress.city}
                        <br />
                        {order.shippingAddress.address}
                      </span>
                    </p>
                  </td>
                  <td className="p-4 uppercase text-xs whitespace-nowrap">
                    {order.paymentMethod === "cod" ? "عند الاستلام" : order.paymentMethod}
                  </td>
                  <td className="p-4 font-semibold whitespace-nowrap">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "text-xs px-2.5 py-1 rounded-full font-medium",
                        STATUS_STYLES[order.status] || "bg-neutral-100 text-neutral-700"
                      )}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-neutral-500">
                    لا توجد طلبات بعد. عند تأكيد أول طلب من المتجر سيظهر هنا فوراً.
                  </td>
                </tr>
              )}
              {loading && orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-neutral-400">
                    جاري التحميل...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
