"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import { Check, MessageCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThankYouClient() {
  const t = useTranslations("thankYou");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "";
  const phone = searchParams.get("phone") || "";

  const whatsappMessage = encodeURIComponent(
    `${t("whatsappMessage")} ${orderNumber}`
  );
  const whatsappUrl = `https://wa.me/212600000000?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center section-padding pt-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-lg w-full text-center"
      >
        <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-8">
          <Check className="h-12 w-12 text-gold" />
        </div>

        <span className="text-gold text-xs tracking-[0.35em] uppercase">{t("badge")}</span>
        <h1 className="font-display text-3xl md:text-4xl font-light mt-4">{t("title")}</h1>
        <p className="text-muted mt-4 leading-relaxed">{t("subtitle")}</p>

        {orderNumber && (
          <div className="mt-8 premium-card rounded-2xl p-6 shadow-soft">
            <p className="text-sm text-muted">{t("orderNumber")}</p>
            <p className="font-display text-2xl text-gold mt-1">{orderNumber}</p>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="gold" size="lg" className="rounded-full" asChild>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              {t("whatsapp")}
            </a>
          </Button>
          <Button variant="outline" size="lg" className="rounded-full" asChild>
            <Link href={`/${locale}/track?order=${orderNumber}&phone=${encodeURIComponent(phone)}`}>
              <Package className="h-4 w-4" />
              {t("track")}
            </Link>
          </Button>
        </div>

        <Link href={`/${locale}/products`} className="inline-flex items-center gap-2 mt-10 text-sm hover:text-gold transition-colors">
          {t("continue")}
          <ArrowRight className="h-4 w-4 rtl-flip" />
        </Link>
      </motion.div>
    </div>
  );
}
