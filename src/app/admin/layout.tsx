"use client";

import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Warehouse,
  Ticket, BarChart3, ArrowLeft, Megaphone,
} from "lucide-react";
import "../globals.css";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/ai", label: "AI System", icon: BarChart3 },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-neutral-50 flex">
          <aside className="w-64 bg-black text-white shrink-0 hidden md:flex md:flex-col relative">
            <div className="p-6">
              <Link href="/admin" className="font-display text-xl tracking-[0.2em]">
                NOOR<span className="text-gold">VA</span>
              </Link>
              <p className="text-xs text-neutral-500 mt-1">Admin Panel</p>
            </div>
            <nav className="px-3 space-y-1 flex-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="p-6">
              <Link href="/ar" className="flex items-center gap-2 text-xs text-neutral-500 hover:text-gold transition-colors">
                <ArrowLeft className="h-3 w-3" /> Back to Store
              </Link>
            </div>
          </aside>
          <main className="flex-1 overflow-auto">
            <div className="md:hidden bg-black text-white p-4 flex items-center justify-between">
              <span className="font-display tracking-[0.2em]">NOOR<span className="text-gold">VA</span> Admin</span>
              <Link href="/ar" className="text-xs text-neutral-400">Store</Link>
            </div>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
