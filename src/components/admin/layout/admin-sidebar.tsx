"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Warehouse, Ticket, BarChart3,
  ArrowLeft, Megaphone, ShieldAlert, Shield, ChevronLeft, ChevronRight, Moon, Sun, LineChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminTheme } from "./admin-theme-provider";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: LineChart },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/ai", label: "AI System", icon: BarChart3 },
  { href: "/admin/fraud", label: "Fraud", icon: ShieldAlert },
  { href: "/admin/security", label: "Security", icon: Shield },
];

export function AdminSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const { theme, toggle } = useAdminTheme();

  return (
    <aside className={cn("sticky top-0 h-screen shrink-0 flex flex-col bg-neutral-950 text-white transition-all duration-300 z-40", collapsed ? "w-[72px]" : "w-64")}>
      <div className={cn("p-5 flex items-center", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && <Link href="/admin" className="font-display text-lg tracking-[0.15em]">NOOR<span className="text-gold">VA</span></Link>}
        <button type="button" onClick={onToggle} className="rounded-lg p-1.5 hover:bg-white/10">{collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}</button>
      </div>
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className="block relative">
              {active && <motion.div layoutId="admin-nav-active" className="absolute inset-0 rounded-xl bg-white/10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className={cn("relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm", active ? "text-white" : "text-neutral-400 hover:text-white hover:bg-white/5", collapsed && "justify-center px-2")}>
                <Icon className="h-4 w-4 shrink-0" />{!collapsed && label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 space-y-1 border-t border-white/10">
        <button type="button" onClick={toggle} className={cn("flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-white hover:bg-white/5", collapsed && "justify-center")}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}{!collapsed && (theme === "dark" ? "Light Mode" : "Dark Mode")}
        </button>
        <Link href="/ar" className={cn("flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-neutral-500 hover:text-gold", collapsed && "justify-center")}>
          <ArrowLeft className="h-3 w-3" />{!collapsed && "Back to Store"}
        </Link>
      </div>
    </aside>
  );
}
