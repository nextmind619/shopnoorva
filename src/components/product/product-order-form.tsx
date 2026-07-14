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
        className="text-sm font-semibold text-red-600 mt-2"
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
  const priceFormatted = formatPriceNumber(variant.price, "ar");
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
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "border-[#D1D5DB] focus:border-[#6366F1] focus:ring-[#6366F1]/20";

  return (
    <section className="mt-0 w-full relative z-10" id="order-form">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-32px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="premium-checkout-card mx-auto w-full max-w-[520px] rounded-[24px] bg-[#FFFFFF] p-5 sm:p-8 ring-1 ring-black/5"
      >
        {/* ── العنوان ── */}
        <header className="text-center mb-7 pb-6 border-b-2 border-[#F3F4F6]">
          <h2 className="text-[1.5rem] sm:text-[1.75rem] font-extrabold tracking-tight text-[#0F172A] leading-tight">
            اطلب الآن وادفع عند الاستلام
          </h2>
          <p className="mt-3 text-[1.05rem] sm:text-lg font-medium text-[#475569] leading-relaxed">
            لن تدفع أي مبلغ الآن. ستدفع فقط عند استلام المنتج
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* ── الحقول ── */}
          <div className="space-y-5">
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
                  rows={4}
                  className={cn(
                    "premium-checkout-textarea ps-14 pt-[18px] min-h-[140px] resize-none leading-relaxed text-[#0F172A]",
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

          {/* ── ملخص الطلب ── */}
          <div className="rounded-[20px] border-2 border-[#E5E7EB] bg-[#F8FAFC] overflow-hidden">
            <div className="px-5 py-4 bg-[#EEF2FF] border-b-2 border-[#E0E7FF]">
              <p className="text-lg font-extrabold text-[#3730A3] text-center tracking-tight">
                ملخص الطلب
              </p>
            </div>

            <div className="p-5 space-y-4">
              {/* المنتج */}
              <div className="flex gap-4 items-center pb-4 border-b border-[#E5E7EB]">
                {productImage && (
                  <div className="relative h-20 w-20 sm:h-[88px] sm:w-[88px] shrink-0 overflow-hidden rounded-2xl border-2 border-[#E5E7EB] bg-white">
                    <Image src={productImage} alt={productName} fill className="object-cover" sizes="88px" />
                  </div>
                )}
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-lg sm:text-xl font-extrabold text-[#0F172A] leading-snug">
                    {productName}
                  </p>
                  <p className="text-base font-semibold text-[#64748B]">
                    الكمية: <span className="text-[#0F172A] font-bold tabular-nums">{quantity}</span>
                  </p>
                  <p className="text-lg font-extrabold text-[#6366F1] tabular-nums">
                    {priceFormatted} درهم
                  </p>
                </div>
              </div>

              {/* شبكة التوصيل / الدفع / الإجمالي */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white border-2 border-[#E5E7EB] p-3 sm:p-4 text-center min-h-[80px]">
                  <span className="text-base sm:text-lg font-extrabold text-[#059669]">مجاني</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#64748B]">التوصيل</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white border-2 border-[#E5E7EB] p-3 sm:p-4 text-center min-h-[80px]">
                  <span className="text-sm sm:text-base font-extrabold text-[#0F172A] leading-tight">عند الاستلام</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#64748B]">طريقة الدفع</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white border-2 border-[#C7D2FE] p-3 sm:p-4 text-center min-h-[80px]">
                  <span className="text-base sm:text-lg font-extrabold text-[#6366F1] tabular-nums">{totalFormatted} درهم</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#64748B]">الإجمالي</span>
                </div>
              </div>
            </div>
          </div>

          {formError && (
            <div className="rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3.5 text-sm font-semibold text-red-700 text-center" role="alert">
              {formError}
            </div>
          )}

          {/* ── زر التأكيد ── */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="premium-checkout-cta w-full h-16 rounded-2xl text-xl font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-7 w-7 animate-spin" aria-hidden />
                  <span>جاري إنشاء الطلب...</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" aria-hidden />
                  <span>تأكيد الطلب</span>
                </>
              )}
            </button>
            <p className="text-center text-base font-semibold text-[#64748B]">
              يتم تأكيد طلبك فوراً
            </p>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
