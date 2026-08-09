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
  locale?: "ar" | "fr";
  /** Split city + street address fields (Moroccan COD flow) */
  extendedAddress?: boolean;
  /** Override submit button label */
  submitLabel?: string;
}

type FormFields = { fullName: string; phone: string; address: string; city: string; streetAddress: string };
type FormErrors = Partial<Record<keyof FormFields, string>>;

const COPY = {
  ar: {
    title: "اطلب الآن وادفع عند الاستلام",
    bullets: ["الدفع عند الاستلام", "لن تدفع أي مبلغ الآن", "ادفع فقط عند استلام الطلب"],
    fullName: "الاسم الكامل",
    fullNamePh: "محمد محمد",
    phone: "رقم الهاتف",
    phonePh: "06XXXXXXXX",
    address: "المدينة",
    addressPh: "كلمة واحدة تكفي — مثال: أكادير",
    city: "المدينة",
    cityPh: "مثال: الدار البيضاء",
    streetAddress: "العنوان بالتفصيل",
    streetAddressPh: "الحي، الشارع، رقم المنزل أو علامة قريبة",
    qty: "الكمية",
    shipping: "الشحن",
    free: "مجاني",
    totalLabel: "الإجمالي عند الاستلام",
    currency: "درهم",
    noPrepay: "بلا دفع مسبق",
    submit: "تأكيد الطلب",
    submitting: "جاري إنشاء الطلب...",
    errName: "الرجاء إدخال الاسم الكامل",
    errPhoneRequired: "الرجاء إدخال رقم الهاتف",
    errPhoneInvalid: "الرجاء إدخال رقم هاتف مغربي صحيح",
    errAddressRequired: "الرجاء إدخال المدينة",
    errStreetRequired: "الرجاء إدخال العنوان",
    errBlocked: "تعذر إتمام الطلب حالياً. يرجى التحقق من معلوماتك أو المحاولة لاحقاً.",
    errGeneric: "تعذر إتمام الطلب. يرجى المحاولة مرة أخرى.",
    errNetwork: "تعذر إتمام الطلب. تحقق من اتصالك وحاول مجدداً.",
  },
  fr: {
    title: "Commandez maintenant — payez à la livraison",
    bullets: ["Paiement à la livraison", "Aucun paiement en ligne", "Payez uniquement à la réception"],
    fullName: "Nom complet",
    fullNamePh: "Mohamed Alaoui",
    phone: "Téléphone",
    phonePh: "06XXXXXXXX",
    address: "Ville",
    addressPh: "Un mot suffit — ex. Agadir",
    city: "Ville",
    cityPh: "Ex. Casablanca",
    streetAddress: "Adresse",
    streetAddressPh: "Quartier, rue ou repère",
    qty: "Quantité",
    shipping: "Livraison",
    free: "Gratuite",
    totalLabel: "Total à la livraison",
    currency: "MAD",
    noPrepay: "Sans paiement anticipé",
    submit: "Confirmer la commande",
    submitting: "Création de la commande...",
    errName: "Veuillez entrer votre nom complet",
    errPhoneRequired: "Veuillez entrer votre numéro de téléphone",
    errPhoneInvalid: "Veuillez entrer un numéro marocain valide",
    errAddressRequired: "Veuillez entrer votre ville",
    errStreetRequired: "Veuillez entrer votre adresse",
    errBlocked: "Commande impossible pour le moment. Vérifiez vos informations ou réessayez plus tard.",
    errGeneric: "Impossible de finaliser la commande. Veuillez réessayer.",
    errNetwork: "Impossible de finaliser. Vérifiez votre connexion et réessayez.",
  },
} as const;

function FieldError({ message }: { message: string }) {
  return (
    <p className="text-sm font-semibold text-red-600 mt-2" role="alert">
      {message}
    </p>
  );
}

export function ProductOrderForm({
  product,
  variant,
  quantity,
  locale = "ar",
  extendedAddress = false,
  submitLabel,
}: ProductOrderFormProps) {
  const router = useRouter();
  const submitting = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const pageLoadedAt = useRef(Date.now());
  const deviceRef = useRef<CollectedDeviceSignals | null>(null);
  const t = COPY[locale];
  const isFr = locale === "fr";

  const [form, setForm] = useState<FormFields>({ fullName: "", phone: "", address: "", city: "", streetAddress: "" });
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

  const productName = isFr ? product.name.fr : product.name.ar;
  const productImage = resolveProductHero(product);
  const shipping = 0;
  const subtotal = variant.price * quantity;
  const total = subtotal + shipping;
  const totalFormatted = formatPriceNumber(total, locale);

  const validateField = (key: keyof FormFields, value: string): string | undefined => {
    switch (key) {
      case "fullName":
        if (!value.trim()) return t.errName;
        return undefined;
      case "phone":
        if (!value.trim()) return t.errPhoneRequired;
        if (!isValidMoroccanPhone(value)) return t.errPhoneInvalid;
        return undefined;
      case "address":
        if (!extendedAddress) {
          if (!value.trim()) return t.errAddressRequired;
        }
        return undefined;
      case "city":
        if (extendedAddress && !value.trim()) return t.errAddressRequired;
        return undefined;
      case "streetAddress":
        if (extendedAddress && !value.trim()) return t.errStreetRequired;
        return undefined;
    }
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    const keys: (keyof FormFields)[] = extendedAddress
      ? ["fullName", "phone", "city", "streetAddress"]
      : ["fullName", "phone", "address"];
    keys.forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) next[key] = err;
    });
    setErrors(next);
    setTouched(Object.fromEntries(keys.map((k) => [k, true])) as Partial<Record<keyof FormFields, boolean>>);
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
      const cityValue = extendedAddress ? form.city.trim() : form.address.trim();
      const addressValue = extendedAddress
        ? `${form.city.trim()} — ${form.streetAddress.trim()}`
        : form.address.trim();

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productId: product.id, variantId: variant.id, quantity: Math.min(3, Math.max(1, quantity)) }],
          shippingAddress: {
            fullName: form.fullName.trim(),
            phone,
            address: addressValue,
            city: cityValue,
            country: "Morocco",
          },
          paymentMethod: "cod",
          locale,
          device: device || undefined,
          honeypot,
          formFillMs,
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
        const purchaseEventId = `purchase_${data.orderNumber}`;

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
            city: cityValue,
            country: "ma",
            fbp: clickIds.fbp,
            fbc: clickIds.fbc,
          },
          sendToServer: false,
        });

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
          address: addressValue,
          product: productName,
          total: String(total),
          productId: product.id,
        });
        router.push(`/ar/thank-you?${params.toString()}`);
        return;
      }

      if (data.blocked) {
        setFormError(t.errBlocked);
      } else {
        setFormError(t.errGeneric);
      }
    } catch {
      setFormError(t.errNetwork);
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  };

  const fieldBorder = (key: keyof FormFields) =>
    errors[key] && touched[key]
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : isFr
        ? "border-[#E5E7EB] focus:border-[#1B4D3E] focus:ring-[#1B4D3E]/20"
        : "border-[#E5E7EB] focus:border-[#6366F1] focus:ring-[#6366F1]/20";

  const iconClass = isFr ? "text-[#6B8F71]" : "text-[#A5B4FC]";
  const totalBoxClass = isFr
    ? "rounded-xl bg-[#E8F2ED] border border-[#1B4D3E]/20 px-4 py-3 text-center"
    : "rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] px-4 py-3 text-center";
  const totalLabelClass = isFr
    ? "text-xs font-bold text-[#1B4D3E] mb-1 flex items-center justify-center gap-1"
    : "text-xs font-bold text-[#4338CA] mb-1 flex items-center justify-center gap-1";
  const totalPriceClass = isFr
    ? "text-3xl font-black text-[#1B4D3E] tabular-nums"
    : "text-3xl font-black text-[#4F46E5] tabular-nums";
  const ctaClass = isFr
    ? "w-full h-16 rounded-2xl text-lg font-black text-white disabled:opacity-60 flex items-center justify-center gap-3 bg-[#1B4D3E] hover:bg-[#163f32] shadow-lg shadow-[#1B4D3E]/25"
    : "premium-checkout-cta w-full h-16 rounded-2xl text-lg font-black text-white disabled:opacity-60 flex items-center justify-center gap-3";

  return (
    <section className="cod-checkout-isolated mt-0 w-full relative z-10" id="order-form" dir={isFr ? "ltr" : undefined}>
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
            {t.title}
          </h2>
          <ul className="mt-4 space-y-2 text-start max-w-sm mx-auto">
            {t.bullets.map((line) => (
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
              {t.fullName}
            </label>
            <div className="relative">
              <User className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 start-5 h-5 w-5", iconClass)} aria-hidden />
              <input
                id="fullName"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                onBlur={() => blurField("fullName")}
                className={cn("premium-checkout-input ps-14", fieldBorder("fullName"))}
                placeholder={t.fullNamePh}
                autoComplete="name"
                disabled={loading}
              />
            </div>
            {touched.fullName && errors.fullName && <FieldError message={errors.fullName} />}
          </div>

          <div>
            <label htmlFor="phone" className="premium-field-label">
              {t.phone}
            </label>
            <div className="relative">
              <Phone className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 start-5 h-5 w-5", iconClass)} aria-hidden />
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                onBlur={() => blurField("phone")}
                className={cn("premium-checkout-input ps-14 tabular-nums", fieldBorder("phone"))}
                placeholder={t.phonePh}
                dir="ltr"
                autoComplete="tel"
                disabled={loading}
              />
            </div>
            {touched.phone && errors.phone && <FieldError message={errors.phone} />}
          </div>

          <div>
            {extendedAddress ? (
              <>
                <div className="mb-5">
                  <label htmlFor="city" className="premium-field-label">
                    {t.city}
                  </label>
                  <div className="relative">
                    <MapPin className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 start-5 h-5 w-5", iconClass)} aria-hidden />
                    <input
                      id="city"
                      type="text"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      onBlur={() => blurField("city")}
                      className={cn("premium-checkout-input ps-14", fieldBorder("city"))}
                      placeholder={t.cityPh}
                      autoComplete="address-level2"
                      disabled={loading}
                    />
                  </div>
                  {touched.city && errors.city && <FieldError message={errors.city} />}
                </div>
                <div>
                  <label htmlFor="streetAddress" className="premium-field-label">
                    {t.streetAddress}
                  </label>
                  <div className="relative">
                    <MapPin className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 start-5 h-5 w-5", iconClass)} aria-hidden />
                    <input
                      id="streetAddress"
                      type="text"
                      value={form.streetAddress}
                      onChange={(e) => updateField("streetAddress", e.target.value)}
                      onBlur={() => blurField("streetAddress")}
                      className={cn("premium-checkout-input ps-14", fieldBorder("streetAddress"))}
                      placeholder={t.streetAddressPh}
                      autoComplete="street-address"
                      disabled={loading}
                    />
                  </div>
                  {touched.streetAddress && errors.streetAddress && <FieldError message={errors.streetAddress} />}
                </div>
              </>
            ) : (
              <>
                <label htmlFor="address" className="premium-field-label">
                  {t.address}
                </label>
                <div className="relative">
                  <MapPin className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 start-5 h-5 w-5", iconClass)} aria-hidden />
                  <input
                    id="address"
                    type="text"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    onBlur={() => blurField("address")}
                    className={cn("premium-checkout-input ps-14", fieldBorder("address"))}
                    placeholder={t.addressPh}
                    autoComplete="address-level2"
                    disabled={loading}
                  />
                </div>
                {touched.address && errors.address && <FieldError message={errors.address} />}
              </>
            )}
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
                <p className="text-xs text-[#64748B] mt-0.5">
                  {t.qty}: {quantity}
                </p>
              </div>
            </div>
            <div className="flex justify-between text-sm font-semibold text-[#475569]">
              <span>{t.shipping}</span>
              <span className="text-emerald-600 font-bold">{t.free}</span>
            </div>
            <div className={totalBoxClass}>
              <p className={totalLabelClass}>
                <Banknote className="h-3.5 w-3.5" />
                {t.totalLabel}
              </p>
              <p className={totalPriceClass}>
                {totalFormatted}
                <span className="text-sm ms-1 font-bold">{t.currency}</span>
              </p>
              <p className="mt-1 text-[11px] font-semibold text-[#64748B] flex items-center justify-center gap-1">
                <Shield className="h-3 w-3" />
                {t.noPrepay}
              </p>
            </div>
          </div>

          {formError && (
            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 text-center" role="alert">
              {formError}
            </div>
          )}

          <button type="submit" disabled={loading} className={ctaClass}>
            {loading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                {t.submitting}
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                {submitLabel ?? t.submit}
              </>
            )}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
