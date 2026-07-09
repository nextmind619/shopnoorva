import { NextResponse } from "next/server";
import { products, getOrders, customers, coupons } from "@/data/products";

export async function GET() {
  const orders = getOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return NextResponse.json({
    stats: {
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      totalProducts: products.length,
      totalCustomers: customers.length,
      lowStock: products.filter((p) => p.stock < 50).length,
    },
    orders: orders.slice(0, 20),
    products: products.map((p) => ({
      id: p.id,
      name: p.name.fr,
      stock: p.stock,
      price: p.price,
      soldCount: p.soldCount,
    })),
    customers,
    coupons,
  });
}
