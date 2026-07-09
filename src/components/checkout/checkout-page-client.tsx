"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Check, Truck, Banknote, CreditCard, Building2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { getProductById, moroccanCities, validateCoupon } from "@/data/products";
import { formatPrice, getLocalized, getShippingCost, generateOrderNumber } from "@/lib/utils";
import type { Locale, PaymentMethod, ShippingAddress } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trackEvent } from "@/components/analytics/analytics-scripts";

export function CheckoutPageClient() {
  const t = useTranslations("checkout");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, couponCode, setCoupon, clearCart } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [couponInput, setCouponInput] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [form, setForm] = useState<ShippingAddress>({
    firstName: searchParams.get("name")?.split(" ")[0] || "",
    lastName: searchParams.get("name")?.split(" ").slice(1).join(" ") || "",
    phone: searchParams.get("phone") || "",
    email: "",
    address: searchParams.get("address") || "",
    city: searchParams.get("city") || "Casablanca",
    region: "",
    postalCode: "",
    country: "Morocco",
  });

  // Handle direct product checkout from URL
  useEffect(() => {
    const productId = searchParams.get("product");
    const variantId = searchParams.get("variant");
    const qty = parseInt(searchParams.get("qty") || "1");
    if (productId && variantId && items.length === 0) {
      useCartStore.getState().addItem({ productId, variantId, quantity: qty });
    }
  }, [searchParams, items.length]);

  const cartItems = items.map((item) => {
    const product = getProductById(item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    const lineTotal = (variant?.price || 0) * item.quantity;
    return { ...item, product, variant, lineTotal };
  }).filter((i) => i.product && i.variant);

  const subtotal = cartItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const shipping = getShippingCost(form.city, subtotal);
  const total = subtotal + shipping - couponDiscount;

  const handleApplyCoupon = () => {
    const result = validateCoupon(couponInput, subtotal);
    if (result.valid) {
      setCouponDiscount(result.discount);
      setCoupon(couponInput);
      setCouponError("");
    } else {
      setCouponError(result.message || "Invalid coupon");
      setCouponDiscount(0);
    }
  };

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
          paymentMethod,
          couponCode: couponCode || undefined,
          subtotal,
          shipping,
          discount: couponDiscount,
          total,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderNumber(data.orderNumber);
        setSuccess(true);
        trackEvent("Purchase", { value: total, currency: "MAD", content_ids: cartItems.map((i) => i.productId) });
        clearCart();
      }
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container-luxury section-padding text-center max-w-lg mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-green-600" />
        </motion.div>
        <h1 className="font-display text-3xl mb-4">{t("orderSuccess")}</h1>
        <p className="text-neutral-500 mb-2">{t("orderNumber")}</p>
        <p className="text-2xl font-semibold text-gold mb-8">{orderNumber}</p>
        <p className="text-sm text-neutral-500 mb-8">Nous vous contacterons sous peu pour confirmer votre commande.</p>
        <Button variant="gold" onClick={() => router.push(`/${locale}/products`)}>Continuer vos achats</Button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container-luxury section-padding text-center">
        <h1 className="font-display text-3xl mb-4">{t("emptyCart")}</h1>
        <Button variant="gold" onClick={() => router.push(`/${locale}/products`)}>Shop Now</Button>
      </div>
    );
  }

  return (
    <div className="container-luxury section-padding">
      <h1 className="font-display text-3xl md:text-4xl mb-10">{t("title")}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-8">
            {/* Contact */}
            <section>
              <h2 className="font-display text-xl mb-4">{t("contact")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label htmlFor="firstName">{t("firstName")}</Label><Input id="firstName" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
                <div><Label htmlFor="lastName">{t("lastName")}</Label><Input id="lastName" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
                <div><Label htmlFor="phone">{t("phone")}</Label><Input id="phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+212 6XX XXX XXX" /></div>
                <div><Label htmlFor="email">{t("email")}</Label><Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              </div>
            </section>

            {/* Shipping */}
            <section>
              <h2 className="font-display text-xl mb-4">{t("shipping")}</h2>
              <div className="space-y-4">
                <div><Label htmlFor="address">{t("address")}</Label><Input id="address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Rue, quartier, numéro..." /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">{t("city")}</Label>
                    <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {moroccanCities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label htmlFor="postalCode">{t("postalCode")}</Label><Input id="postalCode" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} /></div>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="font-display text-xl mb-4">{t("payment")}</h2>
              <div className="space-y-3">
                {([
                  { id: "cod" as const, label: t("cod"), icon: Banknote },
                  { id: "bank_transfer" as const, label: t("bankTransfer"), icon: Building2 },
                  { id: "cmi" as const, label: t("cmi"), icon: CreditCard },
                ]).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id)}
                    className={`w-full flex items-center gap-4 p-4 border transition-colors ${paymentMethod === id ? "border-gold bg-gold/5" : "border-neutral-200 hover:border-neutral-400"}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{label}</span>
                    {paymentMethod === id && <Check className="h-4 w-4 text-gold ms-auto" />}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="border border-neutral-200 p-6 sticky top-28">
              <h2 className="font-display text-xl mb-6">{t("summary")}</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                    <div className="relative w-16 h-20 shrink-0 overflow-hidden bg-neutral-100">
                      <Image src={item.product!.images[0]?.url || ""} alt="" fill className="object-cover" sizes="64px" />
                      <span className="absolute -top-1 -end-1 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{getLocalized(item.product!.name, locale)}</p>
                      <p className="text-xs text-neutral-500">{getLocalized(item.variant!.name, locale)}</p>
                      <p className="text-sm font-semibold mt-1">{formatPrice(item.lineTotal, locale)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-6">
                <Input placeholder={t("coupon")} value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
                <Button type="button" variant="outline" onClick={handleApplyCoupon}>{t("apply")}</Button>
              </div>
              {couponError && <p className="text-red-500 text-xs mb-4">{couponError}</p>}

              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between"><span className="text-neutral-500">{t("subtotal")}</span><span>{formatPrice(subtotal, locale)}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">{t("shippingCost")}</span><span>{shipping === 0 ? "Gratuit" : formatPrice(shipping, locale)}</span></div>
                {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>{t("discount")}</span><span>-{formatPrice(couponDiscount, locale)}</span></div>}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t"><span>{t("total")}</span><span>{formatPrice(total, locale)}</span></div>
              </div>

              <Button variant="gold" size="lg" type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? "..." : t("placeOrder")}
              </Button>

              <div className="flex items-center gap-2 mt-4 text-xs text-neutral-500 justify-center">
                <Truck className="h-3 w-3" />
                Livraison 24-48h · Paiement sécurisé
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
