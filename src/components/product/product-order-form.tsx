"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Loader2, Banknote, Users, MessageCircle, Package, ShoppingBag } from "lucide-react";
import type { Product, ProductVariant } from "@/types";
import { formatPriceNumber, cn } from "@/lib/utils";
import { isValidMoroccanPhone, normalizeMoroccanPhone } from "@/lib/validate-phone";
import { trackEvent } from "@/components/analytics/analytics-scripts";

import { resolveProductHero } from "@/lib/product-images/resolve";

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
  const productImage = resolveProductHero(product);
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
    <section className="mt-0" id="order-form">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[1.5rem] border border-[#2a2a35] bg-[#12121a] text-white shadow-luxury overflow-hidden"
        >
          <div className="px-6 sm:px-8 pt-8 pb-6 text-center border-b border-white/10 bg-[#1a1a24]">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">اطلب الآن وادفع عند الاستلام</h2>
            <p className="text-sm sm:text-base text-white/60 mt-3 leading-relaxed max-w-md mx-auto">
              لن تدفع أي مبلغ الآن. ستدفع فقط عند استلام المنتج
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 mb-8" noValidate>
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-white/40">
                    <Users className="h-5 w-5" />
                  </div>
                  <input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => { setForm({ ...form, fullName: e.target.value }); setErrors((er) => ({ ...er, fullName: undefined })); }}
                    className={cn(fieldClass("fullName"), "ps-12 bg-[#1a1a24] border-white/10 text-white placeholder:text-white/30 focus:border-[#6366f1] focus:ring-[#6366f1]/30")}
                    placeholder="الاسم الكامل"
                    autoComplete="name"
                    disabled={loading}
                  />
                </div>
                {errors.fullName && <p className="text-red-400 text-xs mt-1.5">{errors.fullName}</p>}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-white/40">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors((er) => ({ ...er, phone: undefined })); }}
                    className={cn(fieldClass("phone"), "ps-12 bg-[#1a1a24] border-white/10 text-white placeholder:text-white/30 focus:border-[#6366f1] focus:ring-[#6366f1]/30")}
                    placeholder="رقم الهاتف"
                    dir="rtl"
                    autoComplete="tel"
                    disabled={loading}
                  />
                </div>
                {errors.phone && <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute top-4 start-0 flex items-center ps-4 pointer-events-none text-white/40">
                    <Package className="h-5 w-5" />
                  </div>
                  <textarea
                    id="address"
                    value={form.address}
                    onChange={(e) => { setForm({ ...form, address: e.target.value }); setErrors((er) => ({ ...er, address: undefined })); }}
                    rows={2}
                    className={cn(fieldClass("address"), "ps-12 pt-4 h-auto resize-none bg-[#1a1a24] border-white/10 text-white placeholder:text-white/30 focus:border-[#6366f1] focus:ring-[#6366f1]/30")}
                    placeholder="العنوان الكامل"
                    autoComplete="street-address"
                    disabled={loading}
                  />
                </div>
                {errors.address && <p className="text-red-400 text-xs mt-1.5">{errors.address}</p>}
              </div>

              {formError && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 text-center">
                  {formError}
                </div>
              )}
            </form>

            <div className="rounded-2xl border border-white/10 p-0 mb-6 overflow-hidden">
              <div className="flex items-center justify-center gap-2 py-3 border-b border-white/10 bg-white/5">
                <p className="text-sm font-bold text-white tracking-wider">ملخص الطلب</p>
              </div>
              <div className="p-5">
                <div className="flex gap-4 mb-5">
                  {productImage && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-white">
                      <Image src={productImage} alt={productName} fill className="object-cover" sizes="64px" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="font-bold text-sm leading-snug text-white mb-1">{productName}</p>
                    <p className="text-xs text-white/60">الكمية: {quantity}</p>
                    <p className="text-xs text-[#6366f1] mt-1">{formatPriceNumber(variant.price, "ar")} درهم</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mb-6">
                  <div className="flex-1 bg-[#1a1a24] border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center gap-1">
                    <span className="text-emerald-400 font-bold text-[11px]">مجاني</span>
                    <span className="text-white/60 text-[10px]">التوصيل</span>
                  </div>
                  <div className="flex-1 bg-[#1a1a24] border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center gap-1">
                    <span className="text-white font-bold text-[11px] text-center leading-tight">عند الاستلام</span>
                    <span className="text-white/60 text-[10px]">طريقة الدفع</span>
                  </div>
                  <div className="flex-1 bg-[#1a1a24] border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center gap-1">
                    <span className="text-[#6366f1] font-bold text-[11px] tabular-nums">{formatPriceNumber(total, "ar")} درهم</span>
                    <span className="text-white/60 text-[10px]">الإجمالي</span>
                  </div>
                </div>

                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-14 sm:h-16 rounded-xl bg-[#6366f1] text-white font-bold text-base sm:text-lg hover:bg-[#4f46e5] transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جاري إرسال الطلب...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" />
                      تأكيد الطلب
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-white/50 mt-3">يتم تأكيد طلبك فوراً</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
