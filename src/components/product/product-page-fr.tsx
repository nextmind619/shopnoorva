"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  ChevronDown,
  Shield,
  Truck,
  RotateCcw,
  Banknote,
  ShoppingBag,
  BadgeCheck,
  Minus,
  Plus,
  Check,
  Sparkles,
  Zap,
} from "lucide-react";
import type { Product } from "@/types";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import { products, getProductById, getReviewsForProduct } from "@/data/products";
import { FacebookProductTracker } from "@/components/facebook/facebook-trackers";
import { formatPriceNumber, calculateDiscount, cn } from "@/lib/utils";
import { resolveProductHero } from "@/lib/product-images/resolve";
import { PremiumProductGallery } from "@/components/product/product-gallery-premium";
import { ProductVariantPicker, isPackVariantSku } from "@/components/product/product-variant-picker";

const ProductOrderForm = dynamic(
  () => import("@/components/product/product-order-form").then((m) => m.ProductOrderForm),
  { ssr: true, loading: () => <div className="min-h-[420px]" aria-hidden /> }
);

const FOREST = "#1B4D3E";
const SAGE = "#6B8F71";
const CREAM = "#F7F4EF";

const TRUST_BADGES = [
  { icon: Truck, label: "Livraison gratuite" },
  { icon: Banknote, label: "Paiement à la livraison" },
  { icon: Shield, label: "Garantie Satisfaction" },
  { icon: Sparkles, label: "Qualité Premium" },
  { icon: Zap, label: "Livraison Rapide" },
] as const;

const FEATURE_ICONS = ["✋", "🔥", "🔄", "🪢", "👜", "🔇", "🧘", "✨"] as const;

const FAQS = [
  {
    q: "Livraison — quels délais au Maroc ?",
    a: "Livraison gratuite partout au Maroc : 24–48 h pour les grandes villes, 2–4 jours pour le reste du Royaume. Suivi WhatsApp à chaque étape.",
  },
  {
    q: "Paiement — dois-je payer maintenant ?",
    a: "Non. Paiement à la livraison uniquement (COD). Vous ne payez rien en ligne — vous réglez en espèces à la réception.",
  },
  {
    q: "Garantie — que couvre-t-elle ?",
    a: "Garantie 12 mois sur les défauts de fabrication, plus remplacement sous 7 jours en cas de défaut. Satisfaction garantie.",
  },
  {
    q: "Utilisation — comment bien l’utiliser ?",
    a: "Placez l’appareil autour du cou ou sur la zone à masser, ajustez les sangles, lancez le massage et activez le chauffage si besoin. 10–15 minutes suffisent pour sentir le soulagement.",
  },
  {
    q: "Chauffage — est-il sûr ?",
    a: "Oui. Le chauffage intégré offre une chaleur douce et contrôlée pour détendre les muscles sans brûler. Vous pouvez l’activer ou le désactiver selon votre confort.",
  },
  {
    q: "Nettoyage — comment l’entretenir ?",
    a: "Débranchez l’appareil, essuyez la surface avec un chiffon doux légèrement humide. N’immergez jamais l’appareil dans l’eau.",
  },
  {
    q: "Retour — puis-je renvoyer le produit ?",
    a: "Oui. Contactez-nous sur WhatsApp sous 14 jours en cas de défaut de fabrication. Nous organisons le remplacement ou le retour rapidement.",
  },
] as const;

interface ProductPageFrProps {
  product: Product;
  related?: Product[];
}

export function ProductPageFr({ product, related: relatedProp }: ProductPageFrProps) {
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct);
  const recentlyViewedIds = useRecentlyViewedStore((s) => s.productIds);

  const [variant, setVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const [sticky, setSticky] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const name = product.name.fr;
  const discount = calculateDiscount(variant.price, variant.compareAtPrice);
  const reviews = getReviewsForProduct(product.id);
  const savedAmount =
    variant.compareAtPrice && variant.compareAtPrice > variant.price
      ? variant.compareAtPrice - variant.price
      : 0;

  const related = useMemo(
    () => (relatedProp && relatedProp.length > 0 ? relatedProp : products.filter((p) => p.id !== product.id)).slice(0, 4),
    [relatedProp, product.id],
  );

  const recentlyViewed = useMemo(
    () =>
      recentlyViewedIds
        .filter((id) => id !== product.id)
        .map((id) => getProductById(id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 8),
    [recentlyViewedIds, product.id],
  );

  useEffect(() => {
    addRecentlyViewed(product.id);
  }, [product.id, addRecentlyViewed]);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToOrder = useCallback(() => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const maxQty = Math.min(variant.stock || 3, 3);
  const isPack = isPackVariantSku(variant.sku);
  const orderQty = isPack ? 1 : qty;
  const features = product.features || [];
  const benefits = product.benefits || [];

  return (
    <div className="min-h-screen font-sans text-[#1a2e28] w-full max-w-full overflow-x-clip min-w-0" style={{ background: CREAM }} dir="ltr">
      <FacebookProductTracker
        productId={product.id}
        contentName={product.name.fr}
        value={variant.price}
        currency="MAD"
        quantity={orderQty}
      />

      {/* Free shipping top banner */}
      <div
        className="text-white text-xs sm:text-sm py-2.5 px-4"
        style={{ background: `linear-gradient(90deg, ${FOREST}, ${SAGE})` }}
      >
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-x-5 gap-y-1 text-center">
          <span className="flex items-center gap-1.5 font-semibold">
            <Truck className="h-3.5 w-3.5" /> Livraison gratuite partout au Maroc
          </span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="flex items-center gap-1.5">Paiement à la livraison</span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="flex items-center gap-1.5">Qualité premium</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-28 lg:pb-16 pt-4 space-y-10 sm:space-y-12 min-w-0 w-full">
        <nav className="flex items-center gap-2 text-xs text-[#1B4D3E]/55">
          <Link href="/ar" className="hover:text-[#1B4D3E] transition-colors">
            NOORVA
          </Link>
          <span>/</span>
          <Link href="/ar/products" className="hover:text-[#1B4D3E] transition-colors">
            Boutique
          </Link>
          <span>/</span>
          <span className="font-medium truncate text-[#1B4D3E]/80">{name}</span>
        </nav>

        {/* Hero headline */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center space-y-3"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: SAGE }}>
            Bien-être premium · Maroc
          </p>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight text-[#14352c]">
            Soulagez vos douleurs en quelques minutes
          </h1>
          <p className="text-[#1B4D3E]/70 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Massage Shiatsu 3D + chauffage intégré — détente profonde à la maison, sans rendez-vous.
          </p>
        </motion.section>

        <section aria-label="Galerie produit">
          <div className="rounded-3xl overflow-hidden border border-[#1B4D3E]/10 shadow-lg shadow-[#1B4D3E]/8 bg-white">
            <PremiumProductGallery product={product} />
          </div>
        </section>

        {/* Product name + rating */}
        <section className="space-y-3 text-center sm:text-start">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-[#1B4D3E]/20",
                  )}
                />
              ))}
            </div>
            <span className="text-[#1B4D3E]/60 text-xs">
              {product.rating}/5 · {product.reviewCount.toLocaleString("fr-MA")}+ avis
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight text-[#14352c]">{name}</h2>
          <p className="text-[#1B4D3E]/65 text-base leading-relaxed max-w-xl mx-auto sm:mx-0">
            {product.shortDescription.fr}
          </p>
        </section>

        {/* Price card */}
        <section className="rounded-3xl border border-[#1B4D3E]/10 bg-white/80 backdrop-blur-sm px-6 py-7 sm:px-8 sm:py-8 space-y-4 shadow-md shadow-[#1B4D3E]/6">
          <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
            <span className="text-5xl sm:text-6xl font-black tabular-nums leading-none tracking-tight" style={{ color: FOREST }}>
              {formatPriceNumber(variant.price, "fr")}
            </span>
            <span className="text-lg font-bold text-[#1B4D3E]/70 pb-1">MAD</span>
            {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
              <span className="text-xl text-[#1B4D3E]/35 line-through tabular-nums pb-1.5 ms-1">
                {formatPriceNumber(variant.compareAtPrice, "fr")}
              </span>
            )}
            {savedAmount > 0 && (
              <span className="ms-auto sm:ms-2 mb-1 inline-flex items-center rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-sm font-black px-3.5 py-1.5">
                −{formatPriceNumber(savedAmount, "fr")} MAD
              </span>
            )}
          </div>
          {discount > 0 && (
            <p className="text-sm font-semibold text-[#1B4D3E]/75">
              Au lieu de {formatPriceNumber(variant.compareAtPrice || 0, "fr")} MAD — économisez{" "}
              {formatPriceNumber(savedAmount, "fr")} MAD ({discount}%)
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {["Livraison Gratuite", "Paiement à la livraison", "Qualité Premium"].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-bold border border-[#1B4D3E]/15 bg-[#1B4D3E]/5 text-[#1B4D3E]"
              >
                {badge}
              </span>
            ))}
          </div>
        </section>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={scrollToOrder}
          className="w-full h-14 sm:h-16 rounded-2xl text-white font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-lg transition-transform active:scale-[0.98] hover:brightness-110"
          style={{ background: FOREST, boxShadow: "0 12px 28px rgba(27,77,62,0.28)" }}
        >
          <ShoppingBag className="h-5 w-5" />
          Commander Maintenant
        </button>

        {/* Trust badges */}
        <section className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {TRUST_BADGES.map((b) => (
            <div
              key={b.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[#1B4D3E]/10 bg-white/70 backdrop-blur-sm px-3 py-4 text-center shadow-sm"
            >
              <b.icon className="h-5 w-5" style={{ color: FOREST }} />
              <span className="text-[11px] sm:text-xs font-semibold text-[#1B4D3E]/80 leading-snug">{b.label}</span>
            </div>
          ))}
        </section>

        <ProductVariantPicker
          variants={product.variants}
          selectedId={variant.id}
          onSelect={(v) => {
            setVariant(v);
            setQty(1);
          }}
          locale="fr"
          label="Choisir l'offre"
        />

        {/* Qty */}
        {!isPack && (
        <section className="flex items-center justify-between sm:justify-start gap-6 rounded-2xl border border-[#1B4D3E]/10 bg-white/70 px-5 py-4">
          <span className="text-sm font-medium text-[#1B4D3E]/70">Quantité</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Diminuer la quantité"
              disabled={qty <= 1}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-10 w-10 rounded-full border border-[#1B4D3E]/20 flex items-center justify-center text-[#1B4D3E] disabled:opacity-30 hover:bg-[#1B4D3E]/5"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-lg font-bold tabular-nums">{qty}</span>
            <button
              type="button"
              aria-label="Augmenter la quantité"
              disabled={qty >= maxQty}
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              className="h-10 w-10 rounded-full border border-[#1B4D3E]/20 flex items-center justify-center text-[#1B4D3E] disabled:opacity-30 hover:bg-[#1B4D3E]/5"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </section>
        )}

        <ProductOrderForm product={product} variant={variant} quantity={orderQty} locale="fr" />

        {/* Persuasive description */}
        <section className="rounded-3xl border border-[#1B4D3E]/10 bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-5 text-[#14352c]">Pourquoi vous allez l’adorer</h2>
          <p className="text-[#1B4D3E]/75 text-sm sm:text-base leading-relaxed mb-5 text-center max-w-xl mx-auto">
            {product.description.fr}
          </p>
          <ul className="space-y-3 max-w-lg mx-auto">
            {[
              "Soulage les douleurs cervicales",
              "Réduit les tensions musculaires",
              "Massage Shiatsu profond",
              "Fonction chauffante intégrée",
              "Idéal après une longue journée",
              "Relaxation immédiate",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3 text-sm font-medium text-[#1B4D3E]">
                <span className="mt-0.5 shrink-0 rounded-full p-1" style={{ background: `${FOREST}18` }}>
                  <Check className="h-3.5 w-3.5" style={{ color: FOREST }} />
                </span>
                {line}
              </li>
            ))}
          </ul>
        </section>

        {/* Feature cards */}
        {features.length > 0 && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-[#14352c]">8 atouts premium</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {features.slice(0, 8).map((f, i) => (
                <motion.div
                  key={f.fr}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-24px" }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="rounded-2xl border border-[#1B4D3E]/10 bg-white/80 p-4 text-center shadow-sm"
                >
                  <div className="text-2xl mb-2" aria-hidden>
                    {FEATURE_ICONS[i] || "✨"}
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#14352c] leading-snug">{f.fr}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Benefits BEFORE specs */}
        {benefits.length > 0 && (
          <section className="rounded-3xl border border-[#1B4D3E]/10 bg-white/80 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-[#14352c]">Bienfaits au quotidien</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {benefits.map((b) => (
                <div key={b.fr} className="flex items-start gap-3 rounded-2xl bg-[#1B4D3E]/[0.04] border border-[#1B4D3E]/8 p-4">
                  <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: FOREST }} />
                  <p className="text-sm font-medium text-[#1B4D3E] leading-snug">{b.fr}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Specs */}
        {product.specifications && product.specifications.length > 0 && (
          <section id="specs" className="scroll-mt-24">
            <div className="rounded-3xl border border-[#1B4D3E]/10 bg-white/80 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-[#14352c]">Caractéristiques techniques</h2>
              <div className="max-w-xl mx-auto divide-y divide-[#1B4D3E]/8 rounded-2xl border border-[#1B4D3E]/10 overflow-hidden">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between items-center gap-4 px-5 py-3.5 bg-[#F7F4EF]/60">
                    <span className="text-[#1B4D3E]/55 text-sm">{spec.label.fr}</span>
                    <span className="font-semibold text-[#14352c] text-sm text-end">{spec.value.fr}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Reviews */}
        <section id="reviews" className="scroll-mt-24">
          <div className="rounded-3xl border border-[#1B4D3E]/10 bg-white/80 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-[#14352c]">Avis clients au Maroc</h2>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-[#1B4D3E]/20",
                    )}
                  />
                ))}
              </div>
              <p className="text-[#1B4D3E]/60 text-sm">
                {product.rating}/5 · {product.reviewCount.toLocaleString("fr-MA")} avis
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(showAllReviews ? reviews : reviews.slice(0, 6)).map((r) => (
                <div key={r.id} className="rounded-2xl border border-[#1B4D3E]/10 bg-[#F7F4EF]/80 p-5 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn("h-3.5 w-3.5", i < r.rating ? "fill-amber-400 text-amber-400" : "text-[#1B4D3E]/20")}
                        />
                      ))}
                    </div>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                        <BadgeCheck className="h-3 w-3" />
                        Achat vérifié
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-sm text-[#14352c] mb-2">{r.title.fr}</p>
                  <p className="text-sm text-[#1B4D3E]/70 leading-relaxed flex-1">{r.content.fr}</p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#1B4D3E]/10">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: FOREST }}
                      aria-hidden
                    >
                      {r.author
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-[#14352c]">{r.author}</p>
                      <p className="text-[10px] text-[#1B4D3E]/50 truncate">
                        {r.city} · {new Date(r.date).toLocaleDateString("fr-MA", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {reviews.length > 6 && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllReviews((v) => !v)}
                  className="inline-flex items-center justify-center rounded-full border border-[#1B4D3E]/20 bg-white px-5 py-2.5 text-sm font-bold text-[#1B4D3E] hover:bg-[#1B4D3E]/5 transition-colors"
                >
                  {showAllReviews ? "Voir moins d’avis" : `Voir les ${reviews.length} avis`}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24">
          <div className="rounded-3xl border border-[#1B4D3E]/10 bg-white/80 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-[#14352c]">Questions fréquentes</h2>
            <div className="space-y-2.5 max-w-2xl mx-auto">
              {FAQS.map((faq, i) => (
                <div key={faq.q} className="rounded-2xl border border-[#1B4D3E]/10 bg-[#F7F4EF]/70 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex justify-between items-center px-5 py-4 text-start font-medium text-sm text-[#14352c] hover:text-[#1B4D3E] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", openFaq === i && "rotate-180")} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-[#1B4D3E]/65 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Money-back guarantee */}
        <section id="guarantee" className="scroll-mt-24">
          <div
            className="rounded-3xl border border-[#1B4D3E]/15 p-6 sm:p-8 text-center text-white shadow-lg"
            style={{ background: `linear-gradient(145deg, ${FOREST}, #2d6b55)` }}
          >
            <Shield className="h-10 w-10 mx-auto mb-4 text-white/90" />
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Garantie Satisfait ou Remboursé</h2>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              Essayez votre appareil Shiatsu en toute confiance. Garantie {product.warrantyMonths || 12} mois +
              remplacement sous 7 jours en cas de défaut. Paiement uniquement à la livraison.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
              {[
                { icon: RotateCcw, t: "Remplacement 7 jours" },
                { icon: Shield, t: `Garantie ${product.warrantyMonths || 12} mois` },
                { icon: Banknote, t: "Paiement à la livraison" },
              ].map((item) => (
                <div key={item.t} className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-3 flex flex-col items-center gap-2">
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-semibold">{item.t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-center mb-5 text-[#1B4D3E]/80">Vous aimerez aussi</h2>
            <div className="grid grid-cols-2 gap-3">
              {related.slice(0, 2).map((p) => (
                <Link
                  key={p.id}
                  href={`/ar/products/${p.slug}`}
                  className="group rounded-2xl overflow-hidden border border-[#1B4D3E]/10 bg-white hover:border-[#1B4D3E]/35 transition-colors shadow-sm"
                >
                  <div className="relative aspect-square">
                    <Image src={resolveProductHero(p)} alt={p.name.fr} fill className="object-cover" sizes="40vw" loading="lazy" />
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-xs font-bold line-clamp-2 text-[#14352c] mb-1">{p.name.fr}</p>
                    <p className="text-sm font-bold" style={{ color: FOREST }}>
                      {formatPriceNumber(p.price, "fr")} MAD
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {recentlyViewed.length > 0 && (
          <section className="opacity-90">
            <h2 className="text-sm font-medium text-center mb-4 text-[#1B4D3E]/50">Vu récemment</h2>
            <div className="flex gap-3 overflow-x-auto overscroll-x-contain pb-1 scrollbar-hide max-w-full touch-pan-x">
              {recentlyViewed.map((p) => (
                <Link
                  key={p.id}
                  href={`/ar/products/${p.slug}`}
                  className="shrink-0 w-28 rounded-xl overflow-hidden border border-[#1B4D3E]/10 bg-white"
                >
                  <div className="relative aspect-square">
                    <Image src={resolveProductHero(p)} alt={p.name.fr} fill className="object-cover" sizes="112px" />
                  </div>
                  <p className="text-[10px] font-medium line-clamp-2 text-[#1B4D3E]/70 p-2 text-center">{p.name.fr}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky mobile CTA */}
      <AnimatePresence>
        {sticky && (
          <motion.div
            initial={{ y: 88 }}
            animate={{ y: 0 }}
            exit={{ y: 88 }}
            className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#1B4D3E]/10 safe-area-pb"
          >
            <div className="px-4 py-3 max-w-lg mx-auto">
              <button
                type="button"
                onClick={scrollToOrder}
                className="w-full h-14 rounded-2xl text-base font-black text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg"
                style={{ background: FOREST, boxShadow: "0 8px 20px rgba(27,77,62,0.25)" }}
              >
                <ShoppingBag className="h-5 w-5" />
                Commander — {formatPriceNumber(variant.price * orderQty, "fr")} MAD
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
