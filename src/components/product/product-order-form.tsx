"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, MapPin, Phone, Shield, User } from "lucide-react";
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

const TRUST_PILLS = [
  "الدفع عند الاستلام",
  "توصيل سريع",
  "تأكيد خلال ساعات",
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
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
        className="text-sm font-medium text-red-600 mt-2"
        role="alert"
      >
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

  const fieldBorder = (key: keyof FormFields) =>
    errors[key] && touched[key]
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
      : "border-[#E5E7EB] focus:border-blue-500 focus:ring-blue-500/15";

  return (
    <section className="mt-0 w-full" id="order-form">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-32px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="premium-checkout-card mx-auto w-full max-w-[520px] rounded-[24px] bg-white p-5 sm:p-8"
      >
        {/* Header */}
        <header className="text-center mb-8">
          <div className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 shadow-inner">
            <Shield className="h-9 w-9 text-blue-600" strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="text-[1.35rem] sm:text-2xl font-bold tracking-tight text-[#111827] leading-snug">
            اطلب الآن وادفع عند الاستلام
          </h2>
          <p className="mt-3 text-base sm:text-[17px] text-[#6B7280] leading-relaxed">
            لن تدفع أي مبلغ الآن.
            <br />
            سيتم الدفع فقط عند استلام المنتج.
          </p>
          <ul className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5 sm:gap-y-2">
            {TRUST_PILLS.map((text) => (
              <li key={text} className="flex items-center justify-center gap-2 text-sm font-semibold text-[#374151]">
                <span className="text-emerald-500 text-base leading-none" aria-hidden>✅</span>
                {text}
              </li>
            ))}
          </ul>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Fields */}
          <div className="space-y-5">
            <div>
              <label htmlFor="fullName" className="premium-field-label">
                الاسم الكامل
              </label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-5 h-5 w-5 text-[#9CA3AF]"
                  aria-hidden
                />
                <input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  onBlur={() => blurField("fullName")}
                  className={cn("premium-checkout-input ps-14", fieldBorder("fullName"))}
                  placeholder="مثال: محمد أحمد"
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
                <Phone
                  className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-5 h-5 w-5 text-[#9CA3AF]"
                  aria-hidden
                />
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  onBlur={() => blurField("phone")}
                  className={cn("premium-checkout-input ps-14 tabular-nums", fieldBorder("phone"))}
                  placeholder="06 12 34 56 78"
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
                <MapPin
                  className="pointer-events-none absolute top-5 start-5 h-5 w-5 text-[#9CA3AF]"
                  aria-hidden
                />
                <textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  onBlur={() => blurField("address")}
                  rows={4}
                  className={cn(
                    "premium-checkout-textarea ps-14 pt-[18px] min-h-[140px] resize-none leading-relaxed",
                    fieldBorder("address")
                  )}
                  placeholder="المدينة - الحي - الشارع - رقم المنزل"
                  autoComplete="street-address"
                  disabled={loading}
                />
              </div>
              {touched.address && errors.address && <FieldError message={errors.address} />}
            </div>
          </div>

          {/* Order summary */}
          <div className="premium-summary-card rounded-[20px] border border-[#E5E7EB] bg-[#F9FAFB] p-5 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-wider text-[#6B7280] mb-5 text-center">
              ملخص الطلب
            </p>

            <div className="flex gap-4 items-start mb-6 pb-6 border-b border-[#E5E7EB]">
              {productImage && (
                <div className="relative h-[88px] w-[88px] sm:h-[96px] sm:w-[96px] shrink-0 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
                  <Image
                    src={productImage}
                    alt={productName}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-lg sm:text-xl font-bold text-[#111827] leading-snug line-clamp-2">
                  {productName}
                </p>
              </div>
            </div>

            <dl className="space-y-4">
              <div className="flex justify-between items-center gap-4">
                <dt className="text-base text-[#6B7280]">الكمية</dt>
                <dd className="text-lg font-semibold text-[#111827] tabular-nums">{quantity}</dd>
              </div>
              <div className="flex justify-between items-center gap-4">
                <dt className="text-base text-[#6B7280]">السعر</dt>
                <dd className="text-lg font-semibold text-[#111827] tabular-nums">
                  {formatPriceNumber(subtotal, "ar")} درهم
                </dd>
              </div>
              <div className="flex justify-between items-center gap-4">
                <dt className="text-base text-[#6B7280]">التوصيل</dt>
                <dd className="text-lg font-bold text-emerald-600">مجاني</dd>
              </div>
              <div className="flex justify-between items-center gap-4">
                <dt className="text-base text-[#6B7280]">طريقة الدفع</dt>
                <dd className="text-lg font-semibold text-[#111827]">عند الاستلام</dd>
              </div>
              <div className="h-px bg-[#E5E7EB] my-2" />
              <div className="flex justify-between items-center gap-4 pt-1">
                <dt className="text-xl font-bold text-[#111827]">الإجمالي</dt>
                <dd className="text-2xl sm:text-[1.75rem] font-bold text-[#111827] tabular-nums">
                  {formatPriceNumber(total, "ar")}{" "}
                  <span className="text-base font-semibold text-[#6B7280]">درهم</span>
                </dd>
              </div>
            </dl>
          </div>

          {formError && (
            <div
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-700 text-center"
              role="alert"
            >
              {formError}
            </div>
          )}

          <div className="space-y-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="premium-checkout-cta w-full h-[4.25rem] sm:h-[4.5rem] rounded-2xl text-xl font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.99] shadow-lg shadow-indigo-500/30"
            >
              {loading ? (
                <>
                  <Loader2 className="h-7 w-7 animate-spin" aria-hidden />
                  <span>جاري إنشاء الطلب...</span>
                </>
              ) : (
                <span>اطلب الآن — الدفع عند الاستلام</span>
              )}
            </button>
            <p className="flex items-center justify-center gap-2 text-sm font-medium text-[#6B7280]">
              🔒 معلوماتك آمنة 100%
            </p>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
