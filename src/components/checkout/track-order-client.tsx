"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"] as const;

export function TrackOrderClient() {
  const t = useTranslations("track");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [phone, setPhone] = useState(searchParams.get("phone") || "");
  const [result, setResult] = useState<{ status: string; orderNumber: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/track?order=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (data.found) {
        setResult({ status: data.status, orderNumber: data.orderNumber });
      } else {
        setError(t("notFound"));
        setResult(null);
      }
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const currentStep = result ? STATUS_STEPS.indexOf(result.status as typeof STATUS_STEPS[number]) : -1;

  return (
    <div className="bg-cream min-h-screen section-padding pt-32">
      <div className="container-luxury max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-gold text-xs tracking-[0.35em] uppercase">{t("badge")}</span>
          <h1 className="font-display text-3xl md:text-4xl font-light mt-4">{t("title")}</h1>
          <p className="text-muted mt-3">{t("subtitle")}</p>
        </motion.div>

        <form onSubmit={handleTrack} className="premium-card rounded-2xl p-6 md:p-8 shadow-soft space-y-5">
          <div>
            <Label htmlFor="order">{t("orderNumber")}</Label>
            <Input id="order" required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="mt-1.5 rounded-xl h-12" placeholder="NRV-XXXXXX" />
          </div>
          <div>
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input id="phone" type="tel" required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 rounded-xl h-12" placeholder="+212 6XX XXX XXX" />
          </div>
          <Button variant="gold" type="submit" className="w-full rounded-full" disabled={loading}>
            <Search className="h-4 w-4" />
            {loading ? t("searching") : t("search")}
          </Button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 premium-card rounded-2xl p-6 md:p-8 shadow-soft">
            <div className="flex items-center gap-3 mb-8">
              <Package className="h-5 w-5 text-gold" />
              <div>
                <p className="text-sm text-muted">{t("orderNumber")}</p>
                <p className="font-semibold">{result.orderNumber}</p>
              </div>
            </div>

            <div className="space-y-4">
              {STATUS_STEPS.map((step, i) => {
                const done = i <= currentStep;
                const active = i === currentStep;
                const icons = [Clock, CheckCircle, Package, Truck, CheckCircle];
                const Icon = icons[i];
                return (
                  <div key={step} className={`flex items-center gap-4 ${done ? "opacity-100" : "opacity-40"}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? "bg-gold text-noir" : done ? "bg-gold/20 text-gold" : "bg-black/5"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t(`status.${step}`)}</p>
                      {active && <p className="text-xs text-muted">{t("current")}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
