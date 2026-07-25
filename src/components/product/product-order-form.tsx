"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Loader2, Lock, MapPin, Phone, User, Banknote, Shield } from "lucide-react";
import type { Product, ProductVariant } from "@/types";
import { formatPriceNumber, cn } from "@/lib/utils";
import {
  isValidMoroccanPhone,
  isValidAddress,
  normalizeMoroccanPhone,
  formatMoroccanPhoneInput,
} from "@/lib/validate-phone";
import { trackEvent } from "@/components/analytics/analytics-scripts";
import { resolveProductHero } from "@/lib/product-images/resolve";
import { collectDeviceSignals, type CollectedDeviceSignals } from "@/components/fraud/collect-device";
import { FraudHoneypotFields, readHoneypotFromForm } from "@/components/fraud/honeypot-fields";
import { FacebookCheckoutTracker } from "@/components/facebook/facebook-trackers";
import {
  fbPurchase,
  getEventSourceUrl,
  getFacebookClickIds,
  getReferrerUrl,
} from "@/lib/facebook/events";

interface ProductOrderFormProps {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

type FormFields = { fullName: string; phone: string; address: string };
type FormErrors = Partial<Record<keyof FormFields, string>>;

function FieldError({ message }: { message: string }) {
  return (
    <p className="text-sm font-semibold text-red-600 mt-2" role="alert">
      {message}
    </p>
  );
}

export function ProductOrderForm({ product, variant, quantity }: ProductOrderFormProps) {
  const router = useRouter();
  const submitting = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const pageLoadedAt = useRef(Date.now());
  const deviceRef = useRef<CollectedDeviceSignals | null>(null);

  const [form, setForm] = useState<FormFields>({ fullName: "", phone: "", address: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    pageLoadedAt.current = Date.now();
    let cancelled = false;
    const run = () => {
      collectDeviceSignals()
        .then((signals) => {
          if (!cancelled) deviceRef.current = signals;
        })
        .catch(() => {
          /* collector best-effort */
        });
    };
    // Defer fingerprinting until idle so it never blocks LCP/INP
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(run, { timeout: 4000 });
    } else {
      timeoutId = setTimeout(run, 2500);
    }
    return () => {
      cancelled = true;
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const productName = product.name.ar;
  const productImage = resolveProductHero(product);
  const shipping = 0;
  const subtotal = variant.price * quantity;
  const total = subtotal + shipping;
  const totalFormatted = formatPriceNumber(total, "ar");

  const validateField = (key: keyof FormFields, value: string): string | undefined => {
    switch (key) {
      case "fullName":
        if (!value.trim()) return "الرجاء إدخال الاسم الكامل";
        return undefined;
      case "phone":
        if (!value.trim()) return "الرجاء إدخال رقم الهاتف";
        if (!isValidMoroccanPhone(value)) return "الرجاء إدخال رقم هاتف مغربي صحيح";
        return undefined;
      case "address":
        if (!value.trim()) return "الرجاء إدخال العنوان";
        if (!isValidAddress(value)) return "الرجاء إدخال عنوان تفصيلي كامل";
        return undefined;
    }
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    (["fullName", "phone", "address"] as const).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) next[key] = err;
    });
    setErrors(next);
    setTouched({ fullName: true, phone: true, address: true });
    return Object.keys(next).length === 0;
  };

  const updateField = (key: keyof FormFields, raw: string) => {
    const value = key === "phone" ? formatMoroccanPhoneInput(raw) : raw;
    setForm((prev) => ({ ...prev, [key]: value }));
    if (touched[key]) {
      setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
    }
  };

  const blurField = (key: keyof FormFields) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: validateField(key, form[key]) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    setFormError("");
    if (!validate()) return;

    submitting.current = true;
    setLoading(true);

    try {
      const device = deviceRef.current || (await collectDeviceSignals().catch(() => null));
      const honeypot = formRef.current ? readHoneypotFromForm(formRef.current) : "";
      const formFillMs = Date.now() - pageLoadedAt.current;

      const clickIds = getFacebookClickIds();
      const nameParts = form.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      const phone = normalizeMoroccanPhone(form.phone);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productId: product.id, variantId: variant.id, quantity }],
          shippingAddress: {
            fullName: form.fullName.trim(),
            phone,
            address: form.address.trim(),
            city: "المغرب",
            country: "Morocco",
          },
          paymentMethod: "cod",
          locale: "ar",
          device: device || undefined,
          honeypot,
          formFillMs,
          // Meta CAPI enrichment — never send the access token from the browser
          meta: {
            fbp: clickIds.fbp,
            fbc: clickIds.fbc,
            eventSourceUrl: getEventSourceUrl(),
            referrerUrl: getReferrerUrl(),
          },
        }),
      });

      const data = await res.json();

      if (data.success && data.orderNumber) {
        // Shared event_id with server CAPI → Meta dedupes Pixel + Conversions API
        const purchaseEventId = `purchase_${data.orderNumber}`;

        // Pixel only here; CAPI Purchase is sent after the order is persisted server-side
        fbPurchase({
          eventId: purchaseEventId,
          contentIds: [product.id],
          value: total,
          currency: "MAD",
          orderId: data.orderNumber,
          numItems: quantity,
          userData: {
            phone,
            firstName,
            lastName,
            city: "المغرب",
            country: "ma",
            fbp: clickIds.fbp,
            fbc: clickIds.fbc,
          },
          sendToServer: false,
        });

        // Keep TikTok / dataLayer purchase signal (Meta handled above)
        trackEvent("Purchase", {
          content_ids: [product.id],
          value: total,
          currency: "MAD",
          order_id: data.orderNumber,
        });

        const params = new URLSearchParams({
          order: data.orderNumber,
          name: form.fullName.trim(),
          phone,
          address: form.address.trim(),
          product: productName,
          total: String(total),
          productId: product.id,
        });
        router.push(`/ar/thank-you?${params.toString()}`);
        return;
      }

      if (data.blocked) {
        setFormError("تعذر إتمام الطلب حالياً. يرجى التحقق من معلوماتك أو المحاولة لاحقاً.");
      } else {
        setFormError("تعذر إتمام الطلب. يرجى المحاولة مرة أخرى.");
      }
    } catch {
      setFormError("تعذر إتمام الطلب. تحقق من اتصالك وحاول مجدداً.");
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  };

  const fieldBorder = (key: keyof FormFields) =>
    errors[key] && touched[key]
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "border-[#E5E7EB] focus:border-[#6366F1] focus:ring-[#6366F1]/20";

  return (
    <section className="cod-checkout-isolated mt-0 w-full relative z-10" id="order-form">
      <FacebookCheckoutTracker
        productId={product.id}
        value={total}
        currency="MAD"
        numItems={quantity}
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-32px" }}
        transition={{ duration: 0.4 }}
        className="premium-checkout-card mx-auto w-full max-w-[520px] rounded-[24px] p-5 sm:p-8"
      >
        <header className="text-center mb-6 pb-5 border-b border-[#E5E7EB]">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-black leading-tight">
            اطلب الآن وادفع عند الاستلام
          </h2>
          <ul className="mt-4 space-y-2 text-start max-w-sm mx-auto">
            {[
              "الدفع عند الاستلام",
              "لن تدفع أي مبلغ الآن",
              "ادفع فقط عند استلام الطلب",
            ].map((line) => (
              <li key={line} className="flex items-center gap-2 text-sm font-semibold text-[#065F46]">
                <span className="text-emerald-600" aria-hidden>
                  ✓
                </span>
                {line}
              </li>
            ))}
          </ul>
        </header>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 relative" noValidate>
          <FraudHoneypotFields />

          <div>
            <label htmlFor="fullName" className="premium-field-label">
              الاسم الكامل
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-5 h-5 w-5 text-[#A5B4FC]" aria-hidden />
              <input
                id="fullName"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                onBlur={() => blurField("fullName")}
                className={cn("premium-checkout-input ps-14", fieldBorder("fullName"))}
                placeholder="محمد محمد"
                autoComplete="name"
                disabled={loading}
              />
            </div>
            {touched.fullName && errors.fullName && <FieldError message={errors.fullName} />}
          </div>

          <div>
            <label htmlFor="phone" className="premium-field-label">
              رقم الهاتف
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-5 h-5 w-5 text-[#A5B4FC]" aria-hidden />
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                onBlur={() => blurField("phone")}
                className={cn("premium-checkout-input ps-14 tabular-nums", fieldBorder("phone"))}
                placeholder="06XXXXXXXX"
                dir="ltr"
                autoComplete="tel"
                disabled={loading}
              />
            </div>
            {touched.phone && errors.phone && <FieldError message={errors.phone} />}
          </div>

          <div>
            <label htmlFor="address" className="premium-field-label">
              العنوان الكامل
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute top-5 start-5 h-5 w-5 text-[#A5B4FC]" aria-hidden />
              <textarea
                id="address"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                onBlur={() => blurField("address")}
                rows={3}
                className={cn(
                  "premium-checkout-textarea ps-14 pt-[18px] min-h-[120px] resize-none leading-relaxed",
                  fieldBorder("address"),
                )}
                placeholder="الحي - الشارع - رقم المنزل - الطابق"
                autoComplete="street-address"
                disabled={loading}
              />
            </div>
            {touched.address && errors.address && <FieldError message={errors.address} />}
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 space-y-3">
            <div className="flex gap-3 items-center">
              {productImage && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
                  <Image src={productImage} alt={productName} fill className="object-cover" sizes="64px" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-black line-clamp-2">{productName}</p>
                <p className="text-xs text-[#64748B] mt-0.5">الكمية: {quantity}</p>
              </div>
            </div>
            <div className="flex justify-between text-sm font-semibold text-[#475569]">
              <span>الشحن</span>
              <span className="text-emerald-600 font-bold">مجاني</span>
            </div>
            <div className="rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] px-4 py-3 text-center">
              <p className="text-xs font-bold text-[#4338CA] mb-1 flex items-center justify-center gap-1">
                <Banknote className="h-3.5 w-3.5" />
                الإجمالي عند الاستلام
              </p>
              <p className="text-3xl font-black text-[#4F46E5] tabular-nums">
                {totalFormatted}
                <span className="text-sm ms-1 font-bold">درهم</span>
              </p>
              <p className="mt-1 text-[11px] font-semibold text-[#64748B] flex items-center justify-center gap-1">
                <Shield className="h-3 w-3" />
                بلا دفع مسبق
              </p>
            </div>
          </div>

          {formError && (
            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 text-center" role="alert">
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="premium-checkout-cta w-full h-16 rounded-2xl text-lg font-black text-white disabled:opacity-60 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                جاري إنشاء الطلب...
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                تأكيد الطلب
              </>
            )}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
