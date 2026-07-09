import { NextResponse } from "next/server";
import { products, customers, coupons } from "@/data/products";
import { getAdminOrders, getAdminOrderStats } from "@/lib/orders-admin";

export async function GET() {
  const stats = getAdminOrderStats();
  const orders = getAdminOrders(50);

  return NextResponse.json({
    stats: {
      ...stats,
      totalProducts: products.length,
      totalCustomers: customers.length,
      lowStock: products.filter((p) => p.stock < 50).length,
    },
    orders,
    products: products.map((p) => ({
      id: p.id,
      name: p.name.ar,
      stock: p.stock,
      price: p.price,
      soldCount: p.soldCount,
    })),
    customers,
    coupons,
  });
}
