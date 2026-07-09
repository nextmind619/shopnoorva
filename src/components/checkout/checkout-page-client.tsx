"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Check, Truck, Banknote, MessageCircle } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { getProductById, moroccanCities } from "@/data/products";
import { formatPrice, getLocalized, getShippingCost } from "@/lib/utils";
import { PriceDisplay } from "@/components/shared/price-display";
import type { Locale, ShippingAddress } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trackEvent } from "@/components/analytics/analytics-scripts";
import { TrustBadges } from "@/components/shared/trust-badges";

export function CheckoutPageClient() {
  const t = useTranslations("checkout");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ShippingAddress>({
    fullName: searchParams.get("name") || "",
    phone: searchParams.get("phone") || "",
    address: searchParams.get("address") || "",
    city: searchParams.get("city") || "الدار البيضاء",
    country: "Morocco",
    notes: "",
  });

  useEffect(() => {
    const productId = searchParams.get("product");
    const variantId = searchParams.get("variant");
    const qty = parseInt(searchParams.get("qty") || "1");
    if (productId && variantId && items.length === 0) {
      useCartStore.getState().addItem({ productId, variantId, quantity: qty });
    }
  }, [searchParams, items.length]);

  const cartItems = items
    .map((item) => {
      const product = getProductById(item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      const lineTotal = (variant?.price || 0) * item.quantity;
      return { ...item, product, variant, lineTotal };
    })
    .filter((i) => i.product && i.variant);

  const subtotal = cartItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const shipping = getShippingCost(form.city, subtotal);
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          shippingAddress: form,
          paymentMethod: "cod",
          subtotal,
          shipping,
          discount: 0,
          total,
          locale,
        }),
      });
      const data = await res.json();
      if (data.success) {
        trackEvent("Purchase", { value: total, currency: "MAD", content_ids: cartItems.map((i) => i.productId) });
        clearCart();
        router.push(`/${locale}/thank-you?order=${data.orderNumber}&phone=${encodeURIComponent(form.phone)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container-luxury section-padding pt-32 text-center">
        <h1 className="font-display text-3xl mb-4">{t("emptyCart")}</h1>
        <Button variant="gold" onClick={() => router.push(`/${locale}/products`)}>{t("shopNow")}</Button>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="container-luxury section-padding pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold text-xs tracking-[0.35em] uppercase">{t("badge")}</span>
            <h1 className="font-display text-3xl md:text-5xl font-light mt-4">{t("title")}</h1>
            <p className="text-muted mt-3">{t("subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              <div className="lg:col-span-3 space-y-6">
                <div className="premium-card rounded-2xl p-6 md:p-8 shadow-soft space-y-5">
                  <h2 className="font-display text-xl">{t("contact")}</h2>
                  <div>
                    <Label htmlFor="fullName">{t("fullName")}</Label>
                    <Input id="fullName" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-1.5 rounded-xl border-black/10 h-12" />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t("phone")}</Label>
                    <Input id="phone" type="tel" required dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+212 6XX XXX XXX" className="mt-1.5 rounded-xl border-black/10 h-12" />
                  </div>
                  <div>
                    <Label htmlFor="city">{t("city")}</Label>
                    <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                      <SelectTrigger className="mt-1.5 rounded-xl border-black/10 h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {moroccanCities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="address">{t("address")}</Label>
                    <Input id="address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1.5 rounded-xl border-black/10 h-12" />
                  </div>
                  <div>
                    <Label htmlFor="notes">{t("notes")}</Label>
                    <Input id="notes" value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder={t("notesPlaceholder")} className="mt-1.5 rounded-xl border-black/10 h-12" />
                  </div>
                </div>

                <div className="premium-card rounded-2xl p-6 flex items-center gap-4 border-gold/30">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <Banknote className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium">{t("cod")}</p>
                    <p className="text-sm text-muted">{t("codDesc")}</p>
                  </div>
                  <Check className="h-5 w-5 text-gold ms-auto" />
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="premium-card rounded-2xl p-6 md:p-8 shadow-soft sticky top-32">
                  <h2 className="font-display text-xl mb-6">{t("summary")}</h2>
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                        <div className="relative w-16 h-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                          <Image src={item.product!.images[0]?.url || ""} alt="" fill className="object-cover" sizes="64px" />
                          <span className="absolute -top-1 -end-1 bg-noir text-cream text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{getLocalized(item.product!.name, locale)}</p>
                          <p className="text-xs text-muted">{getLocalized(item.variant!.name, locale)}</p>
                          <div className="mt-1"><PriceDisplay amount={item.lineTotal} size="sm" /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm border-t border-black/5 pt-4">
                    <div className="flex justify-between"><span className="text-muted">{t("subtotal")}</span><span>{formatPrice(subtotal, locale)}</span></div>
                    <div className="flex justify-between"><span className="text-muted">{t("shippingCost")}</span><span>{shipping === 0 ? t("free") : formatPrice(shipping, locale)}</span></div>
                    <div className="flex justify-between font-semibold text-lg pt-3 border-t border-black/5 items-end">
                      <span>{t("total")}</span>
                      <PriceDisplay amount={total} size="md" />
                    </div>
                  </div>
                  <Button variant="gold" size="lg" type="submit" className="w-full mt-6 rounded-full" disabled={loading}>
                    {loading ? t("processing") : t("placeOrder")}
                  </Button>
                  <div className="flex items-center gap-2 mt-4 text-xs text-muted justify-center">
                    <Truck className="h-3 w-3" />
                    {t("deliveryNote")}
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="mt-16">
            <TrustBadges />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
