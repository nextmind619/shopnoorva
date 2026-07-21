"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Loader2,
  Lock,
  MapPin,
  Phone,
  User,
  Building2,
  Minus,
  Plus,
  CheckCircle2,
  Banknote,
  Shield,
} from "lucide-react";
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
import { moroccanCities } from "@/data/products";

interface ProductOrderFormProps {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  onQuantityChange?: (qty: number) => void;
}

type FormFields = { fullName: string; phone: string; city: string; address: string };
type FormErrors = Partial<Record<keyof FormFields, string>>;

function FieldError({ message }: { message: string }) {
  return (
    <AnimatePresence>
      <motion.p
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
        className="text-sm font-semibold text-red-600 mt-2"
        role="alert"
      >
        {message}
      </motion.p>
    </AnimatePresence>
  );
}

export function ProductOrderForm({
  product,
  variant,
  quantity,
  onQuantityChange,
}: ProductOrderFormProps) {
  const router = useRouter();
  const submitting = useRef(false);

  const [form, setForm] = useState<FormFields>({
    fullName: "",
    phone: "",
    city: "",
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const productName = product.name.ar;
  const productImage = resolveProductHero(product);
  const shipping = 0;
  const subtotal = variant.price * quantity;
  const total = subtotal + shipping;
  const priceFormatted = formatPriceNumber(variant.price, "ar");
  const totalFormatted = formatPriceNumber(total, "ar");
  const shippingFormatted = shipping === 0 ? "مجاني" : `${formatPriceNumber(shipping, "ar")} درهم`;

  const setQty = (next: number) => {
    const q = Math.max(1, Math.min(10, next));
    onQuantityChange?.(q);
  };

  const validateField = (key: keyof FormFields, value: string): string | undefined => {
    switch (key) {
      case "fullName":
        if (!value.trim()) return "الرجاء إدخال الاسم الكامل";
        return undefined;
      case "phone":
        if (!value.trim()) return "الرجاء إدخال رقم الهاتف";
        if (!isValidMoroccanPhone(value)) return "الرجاء إدخال رقم هاتف مغربي صحيح";
        return undefined;
      case "city":
        if (!value.trim()) return "الرجاء اختيار المدينة";
        return undefined;
      case "address":
        if (!value.trim()) return "الرجاء إدخال العنوان";
        if (!isValidAddress(value)) return "الرجاء إدخال عنوان تفصيلي كامل";
        return undefined;
    }
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    (["fullName", "phone", "city", "address"] as const).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) next[key] = err;
    });
    setErrors(next);
    setTouched({ fullName: true, phone: true, city: true, address: true });
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
            city: form.city.trim(),
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
          address: `${form.city.trim()} - ${form.address.trim()}`,
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
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "border-[#D1D5DB] focus:border-[#6366F1] focus:ring-[#6366F1]/20";

  return (
    <section className="cod-checkout-isolated mt-0 w-full relative z-10" id="order-form">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-32px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="premium-checkout-card mx-auto w-full max-w-[520px] rounded-[24px] p-5 sm:p-8"
      >
        <header className="text-center mb-5 pb-5 border-b-2 border-[#E5E7EB]">
          <h2 className="text-[1.5rem] sm:text-[1.75rem] font-black tracking-tight text-black leading-tight">
            اطلب الآن وادفع عند الاستلام
          </h2>
          <p className="mt-2 text-base sm:text-lg font-semibold text-[#334155] leading-relaxed">
            عبّئ بياناتك في أقل من دقيقة — والتوصيل لباب دارك
          </p>
        </header>

        <ul className="mb-6 space-y-2.5 rounded-2xl bg-[#ECFDF5] border border-emerald-200 px-4 py-3.5">
          {[
            "الدفع عند الاستلام",
            "لن تدفع أي مبلغ الآن",
            "ادفع فقط عند استلام الطلب",
          ].map((line) => (
            <li key={line} className="flex items-center gap-2.5 text-sm sm:text-base font-bold text-[#065F46]">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="premium-field-label text-[#0F172A]">
                الاسم الكامل
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-5 h-5 w-5 text-[#6366F1]" aria-hidden />
                <input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  onBlur={() => blurField("fullName")}
                  className={cn("premium-checkout-input ps-14 text-[#0F172A]", fieldBorder("fullName"))}
                  placeholder="مثال: محمد أحمد"
                  autoComplete="name"
                  disabled={loading}
                />
              </div>
              {touched.fullName && errors.fullName && <FieldError message={errors.fullName} />}
            </div>

            <div>
              <label htmlFor="phone" className="premium-field-label text-[#0F172A]">
                رقم الهاتف
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-5 h-5 w-5 text-[#6366F1]" aria-hidden />
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  onBlur={() => blurField("phone")}
                  className={cn("premium-checkout-input ps-14 tabular-nums text-[#0F172A]", fieldBorder("phone"))}
                  placeholder="06 12 34 56 78"
                  dir="ltr"
                  autoComplete="tel"
                  disabled={loading}
                />
              </div>
              {touched.phone && errors.phone && <FieldError message={errors.phone} />}
            </div>

            <div>
              <label htmlFor="city" className="premium-field-label text-[#0F172A]">
                المدينة
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-5 h-5 w-5 text-[#6366F1] z-10" aria-hidden />
                <select
                  id="city"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  onBlur={() => blurField("city")}
                  className={cn(
                    "premium-checkout-input ps-14 pe-10 text-[#0F172A] appearance-none bg-white",
                    fieldBorder("city"),
                    !form.city && "text-[#94A3B8]",
                  )}
                  disabled={loading}
                >
                  <option value="">اختر مدينتك</option>
                  {moroccanCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {touched.city && errors.city && <FieldError message={errors.city} />}
            </div>

            <div>
              <label htmlFor="address" className="premium-field-label text-[#0F172A]">
                العنوان الكامل
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute top-5 start-5 h-5 w-5 text-[#6366F1]" aria-hidden />
                <textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  onBlur={() => blurField("address")}
                  rows={3}
                  className={cn(
                    "premium-checkout-textarea ps-14 pt-[18px] min-h-[110px] resize-none leading-relaxed text-[#0F172A]",
                    fieldBorder("address"),
                  )}
                  placeholder="الحي - الشارع - رقم المنزل / الطابق"
                  autoComplete="street-address"
                  disabled={loading}
                />
              </div>
              {touched.address && errors.address && <FieldError message={errors.address} />}
            </div>

            <div>
              <span className="premium-field-label text-[#0F172A]">الكمية</span>
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setQty(quantity - 1)}
                  disabled={loading || quantity <= 1}
                  className="h-12 w-12 rounded-xl border-2 border-[#CBD5E1] bg-white text-[#0F172A] font-bold disabled:opacity-40 flex items-center justify-center"
                  aria-label="إنقاص الكمية"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[3rem] text-center text-2xl font-black tabular-nums text-black">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(quantity + 1)}
                  disabled={loading || quantity >= 10}
                  className="h-12 w-12 rounded-xl border-2 border-[#CBD5E1] bg-white text-[#0F172A] font-bold disabled:opacity-40 flex items-center justify-center"
                  aria-label="زيادة الكمية"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border-2 border-[#CBD5E1] bg-[#F8FAFC] overflow-hidden">
            <div className="px-5 py-3.5 bg-[#4F46E5] border-b-2 border-[#4338CA]">
              <p className="text-lg font-black text-white text-center tracking-tight">ملخص الطلب</p>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex gap-4 items-center pb-4 border-b border-[#E5E7EB]">
                {productImage && (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-[#E5E7EB] bg-white">
                    <Image src={productImage} alt={productName} fill className="object-cover" sizes="80px" />
                  </div>
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-base sm:text-lg font-black text-black leading-snug line-clamp-2">
                    {productName}
                  </p>
                  <p className="text-sm font-bold text-[#475569]">
                    سعر الوحدة:{" "}
                    <span className="text-[#4F46E5] font-black tabular-nums">{priceFormatted} درهم</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-sm sm:text-base">
                <div className="flex justify-between gap-3 font-bold text-[#334155]">
                  <span>سعر المنتج × {quantity}</span>
                  <span className="tabular-nums text-black">{formatPriceNumber(subtotal, "ar")} درهم</span>
                </div>
                <div className="flex justify-between gap-3 font-bold text-[#334155]">
                  <span>تكلفة الشحن</span>
                  <span className="text-emerald-600 font-black">{shippingFormatted}</span>
                </div>
              </div>

              <div className="rounded-2xl bg-[#EEF2FF] border-2 border-[#6366F1] px-4 py-4 text-center">
                <p className="text-sm font-bold text-[#4338CA] mb-1 flex items-center justify-center gap-1.5">
                  <Banknote className="h-4 w-4" />
                  الإجمالي النهائي عند الاستلام
                </p>
                <p className="text-3xl sm:text-4xl font-black text-[#4F46E5] tabular-nums leading-none">
                  {totalFormatted}
                  <span className="text-base ms-1">درهم</span>
                </p>
                <p className="mt-2 text-xs font-semibold text-[#64748B] flex items-center justify-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  بلا دفع مسبق — خلاص كاش عند الباب
                </p>
              </div>
            </div>
          </div>

          {formError && (
            <div
              className="rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3.5 text-sm font-semibold text-red-700 text-center"
              role="alert"
            >
              {formError}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="premium-checkout-cta w-full h-[4.25rem] rounded-2xl text-[1.25rem] sm:text-[1.375rem] font-black text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-7 w-7 animate-spin" aria-hidden />
                  <span>جاري إنشاء الطلب...</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" aria-hidden />
                  <span>تأكيد الطلب الآن</span>
                </>
              )}
            </button>
            <p className="text-center text-base font-bold text-[#475569]">
              يتم تأكيد طلبك فوراً — ونتواصل معك عبر الهاتف
            </p>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
