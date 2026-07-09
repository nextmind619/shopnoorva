"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Loader2, Banknote } from "lucide-react";
import type { Product, ProductVariant } from "@/types";
import { formatPriceNumber, cn } from "@/lib/utils";
import { isValidMoroccanPhone, normalizeMoroccanPhone } from "@/lib/validate-phone";
import { trackEvent } from "@/components/analytics/analytics-scripts";

const TRUST_BADGES = [
  { emoji: "🚚", text: "توصيل سريع إلى جميع مدن المغرب" },
  { emoji: "💵", text: "الدفع عند الاستلام" },
  { emoji: "🔒", text: "معلوماتك محمية وآمنة" },
  { emoji: "🔄", text: "استبدال خلال 7 أيام" },
  { emoji: "⭐", text: "آلاف العملاء يثقون بنا" },
];

interface ProductOrderFormProps {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

type FormFields = { fullName: string; phone: string; address: string };
type FormErrors = Partial<Record<keyof FormFields, string>>;

export function ProductOrderForm({ product, variant, quantity }: ProductOrderFormProps) {
  const router = useRouter();
  const submitting = useRef(false);

  const [form, setForm] = useState<FormFields>({ fullName: "", phone: "", address: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const productName = product.name.ar;
  const productImage = product.images[0]?.url || "";
  const subtotal = variant.price * quantity;
  const total = subtotal;

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.fullName.trim()) next.fullName = "يرجى إدخال الاسم الكامل";
    if (!form.phone.trim()) next.phone = "يرجى إدخال رقم هاتف صحيح";
    else if (!isValidMoroccanPhone(form.phone)) next.phone = "يرجى إدخال رقم هاتف صحيح";
    if (!form.address.trim()) next.address = "يرجى إدخال عنوانك الكامل";
    setErrors(next);
    return Object.keys(next).length === 0;
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

      setFormError("تعذر إتمام الطلب. يرجى المحاولة مرة أخرى أو التواصل معنا عبر واتساب.");
    } catch {
      setFormError("تعذر إتمام الطلب. تحقق من اتصالك وحاول مجدداً.");
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  };

  const fieldClass = (key: keyof FormFields) =>
    cn(
      "w-full h-13 px-4 rounded-2xl border bg-white text-sm transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:border-luxury-gold",
      errors[key] ? "border-red-400" : "border-black/10"
    );

  return (
    <section className="mt-16 sm:mt-20" id="order-form">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[1.75rem] border border-black/5 bg-white/80 backdrop-blur-xl shadow-luxury overflow-hidden"
        >
          <div className="px-6 sm:px-8 pt-8 pb-6 text-center border-b border-black/5 bg-gradient-to-b from-luxury-bg to-white">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">أكمل طلبك الآن</h2>
            <p className="text-sm sm:text-base text-luxury-muted mt-3 leading-relaxed max-w-md mx-auto">
              املأ المعلومات التالية وسيتم تأكيد طلبك في أقل من دقيقة.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="rounded-2xl bg-luxury-bg/80 border border-black/5 p-4 sm:p-5 mb-8">
              <p className="text-xs font-bold text-luxury-gold tracking-wider mb-4">ملخص الطلب</p>
              <div className="flex gap-4">
                {productImage && (
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-black/5">
                    <Image src={productImage} alt={productName} fill className="object-cover" sizes="96px" />
                  </div>
                )}
                <div className="flex-1 min-w-0 space-y-2 text-sm">
                  <p className="font-bold leading-snug">{productName}</p>
                  <div className="flex justify-between text-luxury-muted">
                    <span>السعر</span>
                    <span className="font-semibold text-luxury-black tabular-nums">{formatPriceNumber(variant.price, "ar")} درهم</span>
                  </div>
                  <div className="flex justify-between text-luxury-muted">
                    <span>الكمية</span>
                    <span className="font-semibold">{quantity}</span>
                  </div>
                  <div className="flex justify-between text-luxury-muted">
                    <span>التوصيل</span>
                    <span className="font-semibold text-emerald-600">مجاني</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-black/8">
                    <span className="text-luxury-muted">طريقة الدفع</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-luxury-black text-luxury-bg px-3 py-1.5 rounded-full">
                      <Banknote className="h-3.5 w-3.5" />
                      الدفع عند الاستلام
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="font-bold">الإجمالي النهائي</span>
                    <span className="text-xl font-bold text-luxury-gold tabular-nums">{formatPriceNumber(total, "ar")} درهم</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="fullName" className="text-sm font-semibold mb-2 block">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => { setForm({ ...form, fullName: e.target.value }); setErrors((er) => ({ ...er, fullName: undefined })); }}
                  className={fieldClass("fullName")}
                  placeholder="مثال: أحمد بنعلي"
                  autoComplete="name"
                  disabled={loading}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1.5">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-semibold mb-2 block">
                  رقم الهاتف <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors((er) => ({ ...er, phone: undefined })); }}
                  className={fieldClass("phone")}
                  placeholder="06 XX XX XX XX"
                  dir="ltr"
                  autoComplete="tel"
                  disabled={loading}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="address" className="text-sm font-semibold mb-2 block">
                  العنوان الكامل <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => { setForm({ ...form, address: e.target.value }); setErrors((er) => ({ ...er, address: undefined })); }}
                  rows={3}
                  className={cn(fieldClass("address"), "h-auto py-3 resize-none")}
                  placeholder="المدينة، الحي، الشارع، رقم المنزل..."
                  autoComplete="street-address"
                  disabled={loading}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address}</p>}
              </div>

              {formError && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700 text-center">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 sm:h-16 rounded-full bg-luxury-black text-luxury-bg font-bold text-base sm:text-lg hover:bg-luxury-black/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-luxury"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري إرسال الطلب...
                  </>
                ) : (
                  "تأكيد الطلب"
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-black/5 space-y-3">
              {TRUST_BADGES.map((badge) => (
                <div key={badge.text} className="flex items-center gap-3 text-sm text-luxury-muted">
                  <span className="text-base">{badge.emoji}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
