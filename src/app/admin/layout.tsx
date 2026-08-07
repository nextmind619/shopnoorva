"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { AdminThemeProvider } from "@/components/admin/layout/admin-theme-provider";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import "../globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <AdminThemeProvider>
          <div className="min-h-screen flex">
            <div className="hidden md:block">
              <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
            </div>
            {mobileOpen && (
              <div className="fixed inset-0 z-50 md:hidden">
                <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
                <div className="relative h-full w-64">
                  <AdminSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
                </div>
              </div>
            )}
            <main className="flex-1 min-w-0 overflow-auto">
              <div className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-neutral-950 text-white px-4 py-3">
                <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </button>
                <span className="font-display tracking-[0.15em]">
                  NOOR<span className="text-gold">VA</span>
                </span>
                <div className="w-5" />
              </div>
              {children}
            </main>
          </div>
        </AdminThemeProvider>
      </body>
    </html>
  );
}
