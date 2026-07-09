"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import {
  Star, Check, Sparkles, Moon, Gift, Usb, Radio, Clock, Bluetooth, Palette,
  Shield, Truck, Headphones, Play, Filter,
} from "lucide-react";
import type { Product, Locale, ProductReview } from "@/types";
import { getLocalized } from "@/lib/utils";
import { getProductById, getReviewsForProduct, faqs } from "@/data/products";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import { ProductCard } from "@/components/shared/product-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const BENEFIT_ICONS = [Sparkles, Moon, Gift, Usb, Radio, Clock, Bluetooth, Palette];

interface ProductPageSectionsProps {
  product: Product;
  related: Product[];
  crossSells: Product[];
}

export function ProductPageSections({ product, related, crossSells }: ProductPageSectionsProps) {
  const t = useTranslations("product");
  const tPillars = useTranslations("pillars");
  const tSections = useTranslations("sections");
  const locale = useLocale() as Locale;
  const recentIds = useRecentlyViewedStore((s) => s.productIds).filter((id) => id !== product.id);
  const recentProducts = recentIds.map((id) => getProductById(id)).filter(Boolean) as Product[];

  const allReviews = getReviewsForProduct(product.id);
  const [reviewFilter, setReviewFilter] = useState<"all" | "5" | "photos" | "video">("all");
  const [reviewSort, setReviewSort] = useState<"recent" | "rating">("recent");

  const filteredReviews = useMemo(() => {
    let list = [...allReviews];
    if (reviewFilter === "5") list = list.filter((r) => r.rating === 5);
    if (reviewFilter === "photos") list = list.filter((r) => r.images?.length);
    if (reviewFilter === "video") list = list.filter((r) => r.hasVideo);
    if (reviewSort === "rating") list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return list;
  }, [allReviews, reviewFilter, reviewSort]);

  const lifestyleImage = product.lifestyleImages?.[0] || product.images[0]?.url;
  const scenes = product.lifestyleScenes || [];

  return (
    <div className="mt-20 md:mt-28 space-y-24 md:space-y-32">
      <section aria-labelledby="benefits-heading">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold mb-3">{t("benefits")}</p>
          <h2 id="benefits-heading" className="font-display text-3xl md:text-4xl font-light">{t("benefitsTitle")}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(product.benefits.length ? product.benefits : product.features || []).map((b, i) => {
            const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="premium-card rounded-3xl p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <p className="text-sm font-medium leading-snug">{getLocalized(b, locale)}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold mb-4">{t("description")}</p>
          <h2 className="font-display text-3xl md:text-4xl font-light leading-tight mb-6">{t("storyTitle")}</h2>
          <p className="text-lg text-muted leading-relaxed mb-4">{getLocalized(product.deepDescription || product.description, locale)}</p>
          <p className="text-muted leading-relaxed">{getLocalized(product.description, locale)}</p>
          {product.howToUse && (
            <div className="mt-8 p-6 rounded-3xl bg-cream border border-black/5">
              <p className="text-xs tracking-widest uppercase text-gold font-semibold mb-2">{t("howToUse")}</p>
              <p className="text-sm text-muted leading-relaxed">{getLocalized(product.howToUse, locale)}</p>
            </div>
          )}
        </div>
        {lifestyleImage && (
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-luxury">
            <Image src={lifestyleImage} alt="" fill className="object-cover" sizes="50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-noir/50 via-transparent to-transparent" />
          </div>
        )}
      </section>

      {product.specifications && product.specifications.length > 0 && (
        <section>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-light">{t("specifications")}</h2>
            <p className="text-muted mt-3">{t("specsSubtitle")}</p>
          </div>
          <div className="max-w-3xl mx-auto premium-card rounded-3xl overflow-hidden divide-y divide-black/5">
            {product.specifications.map((spec, i) => (
              <div key={i} className="flex justify-between items-center gap-4 p-5 text-sm hover:bg-cream/50 transition-colors">
                <span className="text-muted">{getLocalized(spec.label, locale)}</span>
                <span className="font-medium text-end">{getLocalized(spec.value, locale)}</span>
              </div>
            ))}
          </div>
          {product.packageIncludes && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {product.packageIncludes.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm p-4 rounded-2xl bg-white border border-black/5">
                  <Check className="h-4 w-4 text-gold shrink-0" />
                  {getLocalized(item, locale)}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="relative rounded-[2rem] overflow-hidden bg-navy text-cream p-8 md:p-16">
        {lifestyleImage && <Image src={lifestyleImage} alt="" fill className="object-cover opacity-20" sizes="100vw" />}
        <div className="relative z-10">
          <p className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold mb-4">{t("lifestyle")}</p>
          <h2 className="font-display text-3xl md:text-5xl font-light max-w-xl mb-12">{t("lifestyleTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(scenes.length ? scenes : [
              { id: "bed", emoji: "🛏️", title: { ar: "غرفة النوم", fr: "Chambre", en: "Bedroom" }, description: { ar: "أجواء هادئة", fr: "Ambiance calme", en: "Calm ambiance" } },
              { id: "game", emoji: "🎮", title: { ar: "جيمنغ", fr: "Gaming", en: "Gaming" }, description: { ar: "سينمائي", fr: "Cinéma", en: "Cinematic" } },
              { id: "gift", emoji: "🎁", title: { ar: "هدية", fr: "Cadeau", en: "Gift" }, description: { ar: "مثالي", fr: "Parfait", en: "Perfect" } },
            ]).map((scene, i) => (
              <motion.div key={scene.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-dark rounded-3xl p-6 hover:bg-white/10 transition-colors">
                <span className="text-3xl">{scene.emoji}</span>
                <h3 className="font-display text-xl mt-4">{getLocalized(scene.title, locale)}</h3>
                <p className="text-sm text-cream/70 mt-2">{getLocalized(scene.description, locale)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-light">{t("whyNoorva")}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {([
            { title: tPillars("quality.title"), desc: tPillars("quality.desc"), icon: Sparkles },
            { title: tPillars("design.title"), desc: tPillars("design.desc"), icon: Palette },
            { title: tPillars("service.title"), desc: tPillars("service.desc"), icon: Headphones },
            { title: tPillars("guarantee.title"), desc: tPillars("guarantee.desc"), icon: Shield },
            { title: t("trust.cod.title"), desc: t("trust.cod.desc"), icon: Truck },
          ]).map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="premium-card rounded-3xl p-6 text-center">
              <item.icon className="h-6 w-6 text-gold mx-auto mb-3" />
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="text-[11px] text-muted mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="reviews">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-light">{t("reviews")}</h2>
            <div className="flex items-center gap-2 mt-3">
              <Star className="h-5 w-5 fill-gold text-gold" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted text-sm">· {allReviews.length} {tSections("reviews_count")}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "5", "photos", "video"] as const).map((f) => (
              <button key={f} type="button" onClick={() => setReviewFilter(f)} className={cn("text-xs px-4 py-2 rounded-full border transition-all", reviewFilter === f ? "bg-noir text-cream border-noir" : "border-black/10 hover:border-gold")}>
                {t(`filter.${f}`)}
              </button>
            ))}
            <button type="button" onClick={() => setReviewSort(reviewSort === "recent" ? "rating" : "recent")} className="text-xs px-4 py-2 rounded-full border border-black/10 flex items-center gap-1 hover:border-gold">
              <Filter className="h-3 w-3" />
              {t(`sort.${reviewSort}`)}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} locale={locale} />
          ))}
        </div>
      </section>

      <section>
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-light">{t("faqTitle")}</h2>
        </div>
        <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="premium-card rounded-2xl px-6 border-none">
              <AccordionTrigger className="text-start font-medium hover:text-gold">{getLocalized(faq.question, locale)}</AccordionTrigger>
              <AccordionContent className="text-muted leading-relaxed">{getLocalized(faq.answer, locale)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {related.length > 0 && (
        <section>
          <h2 className="font-display text-2xl md:text-3xl font-light mb-8">{t("upsells")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {crossSells.length > 0 && (
        <section>
          <h2 className="font-display text-2xl md:text-3xl font-light mb-8">{t("crossSells")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {crossSells.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {recentProducts.length > 0 && (
        <section>
          <h2 className="font-display text-2xl md:text-3xl font-light mb-8">{t("recentlyViewed")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recentProducts.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function ReviewCard({ review, locale }: { review: ProductReview; locale: Locale }) {
  const t = useTranslations("product");
  return (
    <div className="premium-card rounded-3xl p-6">
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={cn("h-3.5 w-3.5", i < review.rating ? "fill-gold text-gold" : "text-neutral-200")} />
        ))}
      </div>
      <h4 className="font-medium">{getLocalized(review.title, locale)}</h4>
      <p className="text-sm text-muted mt-2 leading-relaxed">{getLocalized(review.content, locale)}</p>
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-4">
          {review.images.map((img, i) => (
            <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden">
              <Image src={img} alt="" fill className="object-cover" sizes="64px" />
            </div>
          ))}
        </div>
      )}
      {review.hasVideo && (
        <div className="mt-4 flex items-center gap-2 text-xs text-gold">
          <Play className="h-3.5 w-3.5 fill-gold" />
          {t("customerVideo")}
        </div>
      )}
      <p className="text-xs text-muted mt-4 pt-4 border-t border-black/5">
        {review.author} · {review.city}
        {review.verified && <span className="text-gold ms-2">✓ {t("verified")}</span>}
      </p>
    </div>
  );
}
