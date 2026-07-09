"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 luxury-gradient">
        <Image
          src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1920&q=80"
          alt="LUXMAR Hero"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
      </div>

      <div className="relative container-luxury section-padding w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 text-gold text-xs tracking-[0.3em] uppercase mb-6">
              <span className="w-8 h-px bg-gold" />
              {t("badge")}
            </span>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight">
              {t("title")}
            </h1>

            <p className="mt-6 text-neutral-300 text-base md:text-lg leading-relaxed max-w-lg">
              {t("subtitle")}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button variant="gold" size="lg" asChild>
                <Link href={`/${locale}/products`}>
                  {t("cta")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black" asChild>
                <Link href={`/${locale}/products?filter=bestseller`}>{t("secondary")}</Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-neutral-600 overflow-hidden">
                    <Image
                      src={`https://i.pravatar.cc/32?img=${i + 10}`}
                      alt=""
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                ))}
              </div>
              <span className="text-neutral-400 text-sm">{t("trust")}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
