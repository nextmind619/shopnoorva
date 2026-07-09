"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Star, Minus, Plus, ShoppingBag, Truck, Shield, ChevronLeft, ChevronRight, ZoomIn, Check } from "lucide-react";
import type { Product, Locale } from "@/types";
import { getLocalized, formatPrice, calculateDiscount, getShippingCost } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/product-card";
import { getProductById, getReviewsForProduct } from "@/data/products";
import { trackEvent } from "@/components/analytics/analytics-scripts";
import Link from "next/link";

interface ProductPageClientProps {
  product: Product;
  upsells: Product[];
  crossSells: Product[];
}

export function ProductPageClient({ product, upsells, crossSells }: ProductPageClientProps) {
  const t = useTranslations("product");
  const tSections = useTranslations("sections");
  const locale = useLocale() as Locale;
  const addItem = useCartStore((s) => s.addItem);
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct);

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [city, setCity] = useState("Casablanca");

  const discount = calculateDiscount(selectedVariant.price, selectedVariant.compareAtPrice);
  const reviews = getReviewsForProduct(product.id);
  const shipping = getShippingCost(city, selectedVariant.price * quantity);

  useEffect(() => {
    addRecentlyViewed(product.id);
    trackEvent("ViewContent", { content_ids: [product.id], content_type: "product", value: selectedVariant.price, currency: "MAD" });
  }, [product.id, addRecentlyViewed, selectedVariant.price]);

  useEffect(() => {
    const handleScroll = () => setStickyVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = useCallback(() => {
    addItem({ productId: product.id, variantId: selectedVariant.id, quantity });
    setAddedToCart(true);
    trackEvent("AddToCart", { content_ids: [product.id], value: selectedVariant.price * quantity, currency: "MAD" });
    setTimeout(() => setAddedToCart(false), 2000);
  }, [addItem, product.id, selectedVariant.id, selectedVariant.price, quantity]);

  const nextImage = () => setActiveImage((i) => (i + 1) % product.images.length);
  const prevImage = () => setActiveImage((i) => (i - 1 + product.images.length) % product.images.length);

  return (
    <>
      <div className="container-luxury px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden bg-neutral-100 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={product.images[activeImage]?.url || ""}
                    alt={getLocalized(product.images[activeImage]?.alt || product.name, locale)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover cursor-zoom-in"
                    onClick={() => setZoomOpen(true)}
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              {product.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute start-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={nextImage} className="absolute end-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <button onClick={() => setZoomOpen(true)} className="absolute bottom-3 end-3 bg-white/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-20 shrink-0 overflow-hidden border-2 transition-colors ${i === activeImage ? "border-gold" : "border-transparent"}`}
                >
                  <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span className="text-sm">{product.rating}</span>
                </div>
                <span className="text-neutral-300">|</span>
                <span className="text-sm text-neutral-500">{product.reviewCount} {tSections("reviews_count")}</span>
                <span className="text-neutral-300">|</span>
                <span className="text-sm text-neutral-500">{product.soldCount}+ {tSections("soldCount")}</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-light">{getLocalized(product.name, locale)}</h1>
              <p className="mt-3 text-neutral-600 leading-relaxed">{getLocalized(product.shortDescription, locale)}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold">{formatPrice(selectedVariant.price, locale)}</span>
              {selectedVariant.compareAtPrice && (
                <>
                  <span className="text-lg text-neutral-400 line-through">{formatPrice(selectedVariant.compareAtPrice, locale)}</span>
                  {discount > 0 && (
                    <span className="text-sm bg-gold text-black px-2 py-0.5 font-medium">{t("save")} {discount}%</span>
                  )}
                </>
              )}
            </div>

            {product.variants.length > 1 && (
              <div>
                <p className="text-sm font-medium mb-2">{t("selectVariant")}</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 text-sm border transition-colors ${selectedVariant.id === v.id ? "border-black bg-black text-white" : "border-neutral-200 hover:border-black"}`}
                    >
                      {getLocalized(v.name, locale)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <p className="text-sm font-medium">{t("quantity")}</p>
              <div className="flex items-center border border-neutral-200">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-neutral-50"><Minus className="h-4 w-4" /></button>
                <span className="px-4 text-sm font-medium tabular-nums">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-neutral-50"><Plus className="h-4 w-4" /></button>
              </div>
              <span className={`text-sm ${selectedVariant.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {selectedVariant.stock > 0 ? t("inStock") : t("outOfStock")}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="gold" size="lg" className="flex-1" onClick={handleAddToCart} disabled={selectedVariant.stock <= 0}>
                {addedToCart ? <><Check className="h-4 w-4" /> Added</> : <><ShoppingBag className="h-4 w-4" /> {tSections("addToCart")}</>}
              </Button>
              <Button variant="default" size="lg" className="flex-1" asChild>
                <Link href={`/${locale}/checkout?product=${product.id}&variant=${selectedVariant.id}&qty=${quantity}`}>
                  {tSections("buyNow")}
                </Link>
              </Button>
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-4 w-4 text-gold" />
                <span>{shipping === 0 ? t("freeShipping") : `${t("shippingEstimate")}: ${formatPrice(shipping, locale)}`}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-gold" />
                <span>{t("codAvailable")}</span>
              </div>
            </div>

            {product.benefits.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">{t("benefits")}</h3>
                <ul className="space-y-2">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                      <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                      {getLocalized(b, locale)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Content */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl mb-4">{t("description")}</h2>
              <p className="text-neutral-600 leading-relaxed">{getLocalized(product.description, locale)}</p>
            </div>
            {product.ingredients && (
              <div>
                <h2 className="font-display text-2xl mb-4">{t("ingredients")}</h2>
                <p className="text-neutral-600">{getLocalized(product.ingredients, locale)}</p>
              </div>
            )}
            {product.howToUse && (
              <div>
                <h2 className="font-display text-2xl mb-4">{t("howToUse")}</h2>
                <p className="text-neutral-600">{getLocalized(product.howToUse, locale)}</p>
              </div>
            )}

            {product.beforeAfter && (
              <div>
                <h2 className="font-display text-2xl mb-6">Before / After</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative aspect-square"><Image src={product.beforeAfter.before} alt="Before" fill className="object-cover" sizes="50vw" /></div>
                  <div className="relative aspect-square ring-2 ring-gold"><Image src={product.beforeAfter.after} alt="After" fill className="object-cover" sizes="50vw" /></div>
                </div>
              </div>
            )}

            <div>
              <h2 className="font-display text-2xl mb-6">{t("reviews")} ({reviews.length})</h2>
              <div className="space-y-6">
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="border-b border-neutral-100 pb-6">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                      ))}
                    </div>
                    <h4 className="font-medium text-sm">{getLocalized(review.title, locale)}</h4>
                    <p className="text-sm text-neutral-600 mt-1">{getLocalized(review.content, locale)}</p>
                    <p className="text-xs text-neutral-400 mt-2">{review.author} · {review.city} {review.verified && `· ${t("verified")}`}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COD Form Sidebar */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-neutral-200 p-6 bg-neutral-50">
              <h3 className="font-display text-xl mb-4">Commande Rapide COD</h3>
              <form action={`/${locale}/checkout`} method="GET" className="space-y-3">
                <input type="hidden" name="product" value={product.id} />
                <input type="hidden" name="variant" value={selectedVariant.id} />
                <input type="hidden" name="qty" value={quantity} />
                <input type="text" name="name" placeholder="Nom complet" required className="w-full h-12 px-4 border border-neutral-200 text-sm" />
                <input type="tel" name="phone" placeholder="+212 6XX XXX XXX" required className="w-full h-12 px-4 border border-neutral-200 text-sm" />
                <input type="text" name="city" placeholder="Ville" defaultValue={city} required className="w-full h-12 px-4 border border-neutral-200 text-sm" />
                <input type="text" name="address" placeholder="Adresse" required className="w-full h-12 px-4 border border-neutral-200 text-sm" />
                <Button variant="gold" type="submit" className="w-full">Commander · {formatPrice(selectedVariant.price * quantity + shipping, locale)}</Button>
              </form>
              <p className="text-xs text-neutral-500 mt-3 text-center">Paiement à la livraison · Livraison 24-48h</p>
            </div>
          </div>
        </div>

        {upsells.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl mb-8">{t("upsells")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{upsells.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </div>
        )}

        {crossSells.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl mb-8">{t("crossSells")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{crossSells.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-zoom-out"
            onClick={() => setZoomOpen(false)}
          >
            <div className="relative w-full max-w-4xl aspect-square mx-4">
              <Image src={product.images[activeImage]?.url || ""} alt="" fill className="object-contain" sizes="100vw" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Add to Cart */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 inset-x-0 z-40 bg-white border-t shadow-lg p-4 lg:hidden"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{getLocalized(product.name, locale)}</p>
                <p className="text-sm font-semibold">{formatPrice(selectedVariant.price, locale)}</p>
              </div>
              <Button variant="gold" onClick={handleAddToCart}>{tSections("addToCart")}</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
