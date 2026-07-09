"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import { Star, ChevronLeft, ChevronRight, Play, Check, X } from "lucide-react";
import { products, reviews, faqs } from "@/data/products";
import type { Locale, Product } from "@/types";
import { getLocalized, formatPrice } from "@/lib/utils";
import { PriceDisplay } from "@/components/shared/price-display";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { useState } from "react";

export function TrustGridSection() {
  const t = useTranslations("trustGrid");
  const items = ["shipping", "cod", "warranty", "quality", "secure", "packaging"] as const;
  return (
    <section className="py-10 bg-white border-y border-black/5">
      <div className="container-luxury px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((key, i) => (
            <motion.div key={key} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="text-center p-4">
              <p className="text-sm font-medium">{t(`${key}.title`)}</p>
              <p className="text-[11px] text-muted mt-1">{t(`${key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProblemSection() {
  const t = useTranslations("problems");
  const locale = useLocale() as Locale;

  return (
    <section id="problems" className="section-padding bg-cream">
      <div className="container-luxury px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-light">{t("title")}</h2>
          <p className="text-muted mt-4">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {products.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link href={`/${locale}/products/${product.slug}`} className="block bg-white rounded-3xl p-6 shadow-soft border border-black/5 hover:border-gold/30 hover:shadow-luxury transition-all duration-500 group">
                <span className="text-2xl">{product.problemEmoji}</span>
                <h3 className="font-display text-xl mt-3 group-hover:text-gold transition-colors">{getLocalized(product.problem || product.name, locale)}</h3>
                <p className="text-xs text-gold font-medium mt-3">{t("cause")}</p>
                <p className="text-sm text-muted mt-1">{getLocalized(product.problemCause || product.shortDescription, locale)}</p>
                <p className="text-xs text-gold font-medium mt-3">{t("solution")}</p>
                <p className="text-sm font-medium mt-1">{getLocalized(product.problemSolution || product.name, locale)}</p>
                <p className="text-xs text-muted mt-3">{getLocalized(product.name, locale)}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductDeepDiveSection() {
  const t = useTranslations("products");
  const locale = useLocale() as Locale;
  const addItem = useCartStore((s) => s.addItem);

  return (
    <section className="section-padding bg-white">
      <div className="container-luxury px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-light">{t("title")}</h2>
          <p className="text-muted mt-3">{t("subtitle")}</p>
        </div>
        <div className="space-y-20">
          {products.map((product, i) => (
            <ProductShowcase key={product.id} product={product} locale={locale} reversed={i % 2 === 1} onAdd={() => addItem({ productId: product.id, variantId: product.variants[0].id, quantity: 1 })} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductShowcase({ product, locale, reversed, onAdd }: { product: Product; locale: Locale; reversed: boolean; onAdd: () => void }) {
  const t = useTranslations("products");
  const variant = product.variants[0];
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${reversed ? "lg:[direction:rtl]" : ""}`}>
      <div className={`relative aspect-square rounded-3xl overflow-hidden shadow-luxury ${reversed ? "lg:[direction:ltr]" : ""}`}>
        <Image src={product.images[0]?.url || ""} alt="" fill className="object-cover" sizes="50vw" />
      </div>
      <div className={reversed ? "lg:[direction:ltr]" : ""}>
        <span className="text-2xl">{product.problemEmoji}</span>
        <h3 className="font-display text-2xl md:text-3xl font-light mt-3">{getLocalized(product.name, locale)}</h3>
        <p className="text-muted mt-4 leading-relaxed">{getLocalized(product.deepDescription || product.description, locale)}</p>
        <div className="flex items-baseline gap-3 mt-6">
          <PriceDisplay amount={variant.price} compareAt={variant.compareAtPrice} size="lg" />
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="gold" className="rounded-full" onClick={onAdd}>{t("addToCart")}</Button>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href={`/${locale}/products/${product.slug}`}>{t("details")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ComparisonSection() {
  const t = useTranslations("comparison");
  const rows = ["quality", "colors", "remote", "bluetooth", "warranty", "cod"] as const;
  return (
    <section className="section-padding bg-cream">
      <div className="container-luxury px-4 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-light">{t("title")}</h2>
          <p className="text-muted mt-3">{t("subtitle")}</p>
        </div>
        <div className="bg-white rounded-3xl shadow-soft overflow-hidden border border-black/5">
          <div className="grid grid-cols-3 bg-navy text-cream text-sm font-medium p-4">
            <span>{t("feature")}</span>
            <span className="text-center text-gold">NOORVA</span>
            <span className="text-center">{t("cheap")}</span>
          </div>
          {rows.map((row) => (
            <div key={row} className="grid grid-cols-3 p-4 border-t border-black/5 text-sm items-center">
              <span className="text-muted">{t(`rows.${row}.label`)}</span>
              <span className="text-center flex justify-center"><Check className="h-4 w-4 text-green-600" /></span>
              <span className="text-center flex justify-center"><X className="h-4 w-4 text-red-400" /></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PillarsSection() {
  const t = useTranslations("pillars");
  const keys = ["quality", "design", "service", "guarantee"] as const;
  return (
    <section className="section-padding bg-white">
      <div className="container-luxury px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-light">{t("title")}</h2>
          <p className="text-muted mt-3 max-w-xl mx-auto">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keys.map((key, i) => (
            <motion.div key={key} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-cream rounded-3xl p-6 border border-black/5">
              <h3 className="font-medium text-gold">{t(`${key}.title`)}</h3>
              <p className="text-sm text-muted mt-3 leading-relaxed">{t(`${key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsCarouselSection() {
  const t = useTranslations("sections");
  const locale = useLocale() as Locale;
  const [idx, setIdx] = useState(0);
  const featured = reviews.slice(0, 5);

  return (
    <section className="section-padding bg-cream">
      <div className="container-luxury px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-light">{t("reviews")}</h2>
          <p className="text-muted mt-2">{t("reviewsSubtitle")}</p>
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-black/5 text-center min-h-[220px] flex flex-col justify-center">
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: featured[idx]?.rating || 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-lg leading-relaxed italic">&ldquo;{getLocalized(featured[idx]?.content || { ar: "", fr: "", en: "" }, locale)}&rdquo;</p>
            <p className="mt-4 font-medium">{featured[idx]?.author}</p>
            <p className="text-sm text-muted">{featured[idx]?.city}</p>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={() => setIdx((i) => (i - 1 + featured.length) % featured.length)} className="w-10 h-10 rounded-full border flex items-center justify-center hover:border-gold"><ChevronRight className="h-4 w-4 rtl-flip" /></button>
            <button onClick={() => setIdx((i) => (i + 1) % featured.length)} className="w-10 h-10 rounded-full border flex items-center justify-center hover:border-gold"><ChevronLeft className="h-4 w-4 rtl-flip" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TikTokReviewsSection() {
  const t = useTranslations("sections");
  const locale = useLocale() as Locale;
  const videos = products.map((p) => ({
    name: getLocalized(p.name, locale).split(" ")[0],
    city: "المغرب",
    quote: getLocalized(p.shortDescription, locale).slice(0, 60) + " ✨",
    img: p.images[0]?.url || "",
  }));

  return (
    <section className="section-padding bg-navy text-cream">
      <div className="container-luxury px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-light">{t("tiktokReviews")}</h2>
          <p className="text-cream/60 mt-2">{t("tiktokSubtitle")}</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          {videos.map((v, i) => (
            <div key={i} className="snap-center shrink-0 w-[200px] md:w-[240px] relative aspect-[9/16] rounded-2xl overflow-hidden group">
              <Image src={v.img} alt="" fill className="object-cover" sizes="240px" />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-gold/80 transition-colors">
                  <Play className="h-5 w-5 fill-white text-white ms-0.5" />
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-4">
                <p className="text-sm">{v.quote}</p>
                <p className="text-xs text-cream/60 mt-1">{v.name} · {v.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const t = useTranslations("howItWorks");
  const locale = useLocale();
  const steps = ["step1", "step2", "step3"] as const;
  return (
    <section className="section-padding bg-white">
      <div className="container-luxury px-4 max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl font-light mb-12">{t("title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step} className="relative">
              <span className="font-display text-5xl text-gold/20">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-medium mt-2">{t(`${step}.title`)}</h3>
              <p className="text-sm text-muted mt-2">{t(`${step}.desc`)}</p>
            </div>
          ))}
        </div>
        <Button variant="gold" size="lg" className="mt-12 rounded-full" asChild>
          <Link href={`/${locale}/checkout`}>{t("ctaButton")}</Link>
        </Button>
      </div>
    </section>
  );
}

export function GuaranteeSection() {
  const t = useTranslations("guarantee");
  return (
    <section className="section-padding bg-gold/10 border-y border-gold/20">
      <div className="container-luxury px-4 max-w-2xl mx-auto text-center">
        <h2 className="font-display text-3xl font-light">{t("title")}</h2>
        <p className="text-muted mt-4 leading-relaxed">{t("desc")}</p>
      </div>
    </section>
  );
}

export function FAQSection() {
  const t = useTranslations("sections");
  const locale = useLocale() as Locale;
  return (
    <section className="section-padding bg-cream">
      <div className="container-luxury px-4 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-light">{t("faq")}</h2>
          <p className="text-muted mt-2">{t("faqSubtitle")}</p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="bg-white rounded-2xl px-5 border border-black/5 shadow-soft">
              <AccordionTrigger className="text-sm font-medium hover:text-gold">{getLocalized(faq.question, locale)}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted pb-4">{getLocalized(faq.answer, locale)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function FinalCTASection() {
  const t = useTranslations("finalCta");
  const locale = useLocale();
  return (
    <section className="section-padding bg-navy text-cream text-center">
      <div className="container-luxury px-4 max-w-xl mx-auto">
        <h2 className="font-display text-3xl font-light">{t("title")}</h2>
        <p className="text-cream/70 mt-4">{t("subtitle")}</p>
        <Button variant="gold" size="lg" className="mt-8 rounded-full px-10" asChild>
          <Link href={`/${locale}/products`}>{t("cta")}</Link>
        </Button>
      </div>
    </section>
  );
}
