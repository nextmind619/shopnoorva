"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_URL } from "@/lib/site";

const TRUST_PILLS = ["cod", "morocco", "quality", "warranty", "shipping"] as const;
const HERO_IMAGE = "/hero/collection-banner.png";
const WA_HREF = `${WHATSAPP_URL}?text=${encodeURIComponent("مرحباً NOORVA، أريد الاستفسار عن المنتجات")}`;

export function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative bg-cream overflow-hidden">
      <div className="container-luxury px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-light leading-[1.15] text-noir">
              {t("title")}
            </h1>
            <p className="mt-6 text-muted text-base md:text-lg leading-relaxed max-w-xl">
              {t("subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {TRUST_PILLS.map((key) => (
                <span key={key} className="inline-flex flex-col items-center bg-white border border-black/5 rounded-2xl px-4 py-3 min-w-[90px] shadow-soft">
                  <span className="text-[10px] font-bold text-gold tracking-wider">{t(`pills.${key}.label`)}</span>
                  <span className="text-[10px] text-muted mt-0.5 text-center">{t(`pills.${key}.desc`)}</span>
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button variant="gold" size="lg" className="rounded-full px-8" asChild>
                <Link href={`/${locale}/products`}>{t("cta")}</Link>
              </Button>
              <Button
                size="lg"
                className="rounded-full px-8 bg-[#25D366] hover:bg-[#1ebe57] text-white border-0"
                asChild
              >
                <a href={WA_HREF} target="_blank" rel="noopener noreferrer">
                  {t("whatsapp")}
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative w-full aspect-[3/2] max-w-xl mx-auto lg:ms-auto"
          >
            <div className="absolute inset-0 bg-gold/10 rounded-full blur-3xl" />
            <Image
              src={HERO_IMAGE}
              alt="مجموعة بروجيكتور النجوم والمجرة NOORVA"
              fill
              priority
              className="object-cover rounded-3xl shadow-luxury"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {(["customers", "rating", "orders", "satisfaction"] as const).map((key) => (
            <div key={key} className="text-center bg-white rounded-2xl p-5 shadow-soft border border-black/5">
              <p className="font-display text-2xl md:text-3xl text-gold">{t(`stats.${key}.value`)}</p>
              <p className="text-xs text-muted mt-1">{t(`stats.${key}.label`)}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
