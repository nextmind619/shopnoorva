"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Lock, MapPin, Phone, User } from "lucide-react";
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

const TRUST_ITEMS = [
  { emoji: "🔒", text: "معلوماتك محمية وآمنة" },
  { emoji: "🚚", text: "توصيل سريع إلى جميع مدن المغرب" },
  { emoji: "💵", text: "الدفع عند الاستلام فقط" },
  { emoji: "↩️", text: "استبدال خلال 7 أيام" },
];

interface ProductOrderFormProps {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

type FormFields = { fullName: string; phone: string; address: string };
type FormErrors = Partial<Record<keyof FormFields, string>>;

function FieldError({ message }: { message: string }) {
  return (
    <AnimatePresence>
      <motion.p
        initial={{ opacity: 0, y: -4, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -4, height: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-1.5 text-sm text-red-400 mt-2 pe-1"
        role="alert"
      >
        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" aria-hidden />
        {message}
      </motion.p>
    </AnimatePresence>
  );
}

export function ProductOrderForm({ product, variant, quantity }: ProductOrderFormProps) {
  const router = useRouter();
  const submitting = useRef(false);

  const [form, setForm] = useState<FormFields>({ fullName: "", phone: "", address: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const productName = product.name.ar;
  const productImage = resolveProductHero(product);
  const subtotal = variant.price * quantity;
  const total = subtotal;

  const validateField = (key: keyof FormFields, value: string): string | undefined => {
    switch (key) {
      case "fullName":
        if (!value.trim()) return "الاسم الكامل مطلوب لإتمام طلبك";
        if (value.trim().length < 3) return "يرجى إدخال اسمك الكامل (3 أحرف على الأقل)";
        return undefined;
      case "phone":
        if (!value.trim()) return "رقم الهاتف مطلوب للتواصل معك";
        if (!isValidMoroccanPhone(value)) return "يرجى إدخال رقم مغربي صحيح (مثال: 06 12 34 56 78)";
        return undefined;
      case "address":
        if (!value.trim()) return "العنوان مطلوب لتوصيل طلبك";
        if (!isValidAddress(value)) return "يرجى إدخال عنوان تفصيلي (المدينة، الحي، الشارع، رقم المنزل)";
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
    } else {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
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
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productId: product.id, variantId: variant.id, quantity }],
          shippingAddress: {
            fullName: form.fullName.trim(),
            phone: normalizeMoroccanPhone(form.phone),
            address: form.address.trim(),
            city: "المغرب",
            country: "Morocco",
          },
          paymentMethod: "cod",
          locale: "ar",
        }),
      });

      const data = await res.json();

      if (data.success && data.orderNumber) {
        trackEvent("Purchase", {
          content_ids: [product.id],
          value: total,
          currency: "MAD",
        });

        const params = new URLSearchParams({
          order: data.orderNumber,
          name: form.fullName.trim(),
          phone: normalizeMoroccanPhone(form.phone),
          address: form.address.trim(),
          product: productName,
          total: String(total),
        });
        router.push(`/ar/thank-you?${params.toString()}`);
        return;
      }

      setFormError("تعذر إتمام الطلب. يرجى المحاولة مرة أخرى.");
    } catch {
      setFormError("تعذر إتمام الطلب. تحقق من اتصالك وحاول مجدداً.");
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  };

  const inputClass = (key: keyof FormFields) =>
    cn(
      "cod-field w-full rounded-2xl border bg-white/[0.04] text-base sm:text-lg text-white",
      "placeholder:text-white/30 transition-all duration-300",
      "focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400/50 focus:bg-white/[0.06]",
      errors[key] && touched[key]
        ? "border-red-400/60 ring-1 ring-red-400/20"
        : "border-white/10 hover:border-white/20"
    );

  return (
    <section className="mt-0" id="order-form">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="cod-form-glass rounded-[1.75rem] overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-6 sm:px-8 pt-8 pb-6 text-center border-b border-white/[0.08]">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-500/[0.08] to-transparent"
            aria-hidden
          />
          <h2 className="relative font-display text-2xl sm:text-[1.65rem] font-bold tracking-tight text-white leading-snug">
            اطلب الآن وادفع عند الاستلام
          </h2>
          <p className="relative text-base sm:text-lg text-white/55 mt-3 leading-relaxed max-w-sm mx-auto">
            لن تدفع أي شيء الآن.
            <br />
            ادفع فقط عند استلام طلبك.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6" noValidate>
          {/* Fields */}
          <div className="space-y-5">
            {/* Full name */}
            <div>
              <label htmlFor="fullName" className="cod-label flex items-center gap-2 mb-2.5">
                <span aria-hidden>👤</span>
                <span>الاسم الكامل</span>
              </label>
              <div className="relative">
                <User
                  className="absolute top-1/2 -translate-y-1/2 start-4 h-5 w-5 text-white/25 pointer-events-none"
                  aria-hidden
                />
                <input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  onBlur={() => blurField("fullName")}
                  className={cn(inputClass("fullName"), "h-14 ps-12 pe-4")}
                  placeholder="أدخل اسمك الكامل"
                  autoComplete="name"
                  disabled={loading}
                />
              </div>
              {touched.fullName && errors.fullName && <FieldError message={errors.fullName} />}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="cod-label flex items-center gap-2 mb-2.5">
                <span aria-hidden>📞</span>
                <span>رقم الهاتف</span>
              </label>
              <div className="relative">
                <Phone
                  className="absolute top-1/2 -translate-y-1/2 start-4 h-5 w-5 text-white/25 pointer-events-none"
                  aria-hidden
                />
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  onBlur={() => blurField("phone")}
                  className={cn(inputClass("phone"), "h-14 ps-12 pe-4 tabular-nums tracking-wide")}
                  placeholder="06XXXXXXXX"
                  dir="ltr"
                  autoComplete="tel"
                  disabled={loading}
                />
              </div>
              {touched.phone && errors.phone && <FieldError message={errors.phone} />}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="cod-label flex items-center gap-2 mb-2.5">
                <span aria-hidden>📍</span>
                <span>العنوان الكامل</span>
              </label>
              <div className="relative">
                <MapPin
                  className="absolute top-4 start-4 h-5 w-5 text-white/25 pointer-events-none"
                  aria-hidden
                />
                <textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  onBlur={() => blurField("address")}
                  rows={4}
                  className={cn(inputClass("address"), "min-h-[120px] ps-12 pe-4 pt-4 pb-4 resize-none leading-relaxed")}
                  placeholder="المدينة - الحي - الشارع - رقم المنزل"
                  autoComplete="street-address"
                  disabled={loading}
                />
              </div>
              {touched.address && errors.address && <FieldError message={errors.address} />}
            </div>
          </div>

          {/* Order summary */}
          <div className="cod-summary rounded-2xl border border-white/[0.08] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.03]">
              <p className="text-sm font-bold text-white/70 tracking-wide text-center">ملخص الطلب</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex gap-4 items-center">
                {productImage && (
                  <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0 border border-white/10 bg-white/5 shadow-lg">
                    <Image src={productImage} alt={productName} fill className="object-cover" sizes="72px" />
                  </div>
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs text-white/45 font-medium">اسم المنتج</p>
                  <p className="font-bold text-base text-white leading-snug line-clamp-2">{productName}</p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex justify-between items-center text-base">
                  <span className="text-white/50">الكمية</span>
                  <span className="font-semibold text-white tabular-nums">{quantity}</span>
                </div>
                <div className="flex justify-between items-center text-base">
                  <span className="text-white/50">السعر</span>
                  <span className="font-semibold text-white tabular-nums">
                    {formatPriceNumber(subtotal, "ar")} <span className="text-sm text-white/60">درهم</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-base">
                  <span className="text-white/50">التوصيل</span>
                  <span className="font-bold text-emerald-400">مجاني</span>
                </div>
                <div className="h-px bg-white/[0.06] my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">الإجمالي</span>
                  <span className="text-xl sm:text-2xl font-bold text-violet-300 tabular-nums">
                    {formatPriceNumber(total, "ar")}{" "}
                    <span className="text-sm font-semibold text-white/50">درهم</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {formError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3.5 text-sm text-red-300 text-center leading-relaxed"
              role="alert"
            >
              {formError}
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="cod-submit-btn btn-cosmic w-full h-[3.75rem] sm:h-16 rounded-2xl font-bold text-lg sm:text-xl disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-3 relative overflow-hidden"
          >
            {loading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
                <span>جاري تأكيد طلبك...</span>
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 opacity-90" aria-hidden />
                <span>تأكيد الطلب</span>
              </>
            )}
          </button>

          {/* Trust badges */}
          <ul className="space-y-3 pt-1">
            {TRUST_ITEMS.map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-sm sm:text-base text-white/55">
                <span className="text-lg shrink-0" aria-hidden>{item.emoji}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </form>
      </motion.div>
    </section>
  );
}
