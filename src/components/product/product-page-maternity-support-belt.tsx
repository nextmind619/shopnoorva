"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Banknote,
  Truck,
  Heart,
  Shield,
  Baby,
  Sparkles,
  Check,
  Gift,
  Thermometer,
  Activity,
} from "lucide-react";
import type { Product, ProductReview } from "@/types";
import {
  MATERNITY_BELT_COMPARE_MAD,
  MATERNITY_BELT_FAQS,
  MATERNITY_BELT_FEATURES_IMAGE,
  MATERNITY_BELT_GIFT_IMAGE,
  MATERNITY_BELT_IN_USE_IMAGE,
  MATERNITY_BELT_INFOGRAPHIC_IMAGE,
  MATERNITY_BELT_LIFESTYLE_IMAGE,
  MATERNITY_BELT_PRICE_MAD,
} from "@/data/maternity-support-belt";
import { formatPriceNumber, cn, calculateDiscount } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ProductOrderForm = dynamic(
  () => import("@/components/product/product-order-form").then((m) => m.ProductOrderForm),
  { ssr: false, loading: () => <div className="min-h-[320px] animate-pulse rounded-2xl bg-rose-100/40" aria-hidden /> },
);

const PRICE = MATERNITY_BELT_PRICE_MAD;
const COMPARE = MATERNITY_BELT_COMPARE_MAD;

const BENEFITS = [
  {
    icon: Heart,
    title: "يدعم البطن ويخفّف الضغط",
    desc: "حزام متعدد الطبقات كيحمل وزن البطن باش ما يبقاش كله على الظهر.",
  },
  {
    icon: Activity,
    title: "يحسّن وضعية الظهر",
    desc: "دعم من الخلف وأسفل البطن — مشي ووقوف براحة أكثر.",
  },
  {
    icon: Sparkles,
    title: "مريح وقابل للتعديل",
    desc: "أشرطة وخطافات باش تزيدي/نقصي حسب شهر الحمل.",
  },
  {
    icon: Shield,
    title: "قماش مريح وقابل للتنفس",
    desc: "مناسب للاستعمال اليومي فالدار، الخروج، والراحة.",
  },
];

const STEPS = [
  { n: "1", title: "قفّي واقفة بشكل طبيعي", desc: "البطن مرتاح، الكتاف مفلوتين." },
  { n: "2", title: "لفّي الحزام تحت البطن", desc: "الجزء العريض كيدعم أسفل البطن (مش فوق بزاف)." },
  { n: "3", title: "ثبّتي الأشرطة من الخلف", desc: "شدّي براحتك — ما تبالغيش باش ما يضغطش." },
  { n: "4", title: "عدّلي حسب النهار", desc: "فاش تكبر البطن، زيدي التعديل بخطوات صغيرة." },
];

const TRIMESTERS = [
  { label: "الثلث الثاني", desc: "من لي يبدا البطن يبان — دعم خفيف ومريح." },
  { label: "الثلث الثالث", desc: "ضغط أكبر على الظهر — الحزام كيساعد فالمشي والوقوف." },
  { label: "بعد الولادة", desc: "بعض الأمهات كيستعملوه فترة قصيرة للدعم (حسب الطبيب)." },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} من 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn("text-lg", i < Math.round(rating) ? "text-amber-400" : "text-rose-200")}
          aria-hidden
        >
          ★
        </span>
      ))}
    </span>
  );
}

function ImageSlot({
  src,
  alt,
  priority,
  loading,
  sizes = "(max-width: 512px) 100vw, 480px",
  aspect = "aspect-square",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  sizes?: string;
  aspect?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-rose-200/80 bg-white shadow-md shadow-rose-900/5",
        aspect,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : loading ?? "lazy"}
        sizes={sizes}
        className="object-contain p-2"
      />
    </div>
  );
}

interface Props {
  product: Product;
  reviews: ProductReview[];
}

export function ProductPageMaternitySupportBelt({ product, reviews }: Props) {
  const variant = product.variants[0];
  const gift = product.gift?.enabled ? product.gift : undefined;
  const [sticky, setSticky] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const formSentinel = useRef<HTMLDivElement>(null);

  const scrollToOrder = useCallback(() => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = formSentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), {
      threshold: 0.08,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const featuresSrc = MATERNITY_BELT_FEATURES_IMAGE;
  const lifestyleSrc = MATERNITY_BELT_LIFESTYLE_IMAGE;
  const inUseSrc = MATERNITY_BELT_IN_USE_IMAGE;
  const infographicSrc = MATERNITY_BELT_INFOGRAPHIC_IMAGE;
  const giftSrc = gift?.giftImage ?? MATERNITY_BELT_GIFT_IMAGE;
  const discount = calculateDiscount(PRICE, COMPARE);
  const showSticky = sticky && !formVisible;

  const orderFormBlock = (
    <div ref={formSentinel} className="space-y-4">
      <div className="rounded-2xl border-2 border-rose-300/60 bg-white p-4 text-center space-y-2 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-rose-600">العرض الكامل</p>
        <p className="text-lg font-bold text-[#4a1942] leading-snug">
          حزام دعم الحمل 🎀 + ميزان حرارة رقمي 🎁
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-rose-800/60 line-through tabular-nums">
            {formatPriceNumber(COMPARE, "ar")} درهم
          </span>
          <span className="text-3xl font-black tabular-nums text-rose-700">
            {formatPriceNumber(PRICE, "ar")}{" "}
            <span className="text-lg font-bold">درهم</span>
          </span>
          {discount > 0 && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              وفّري {discount}%
            </span>
          )}
        </div>
        <p className="text-sm text-rose-900/70">💵 الدفع عند الاستلام · 🚚 توصيل مجاني</p>
      </div>

      <ProductOrderForm
        product={product}
        variant={variant}
        quantity={1}
        formTitle="اطلبي راحتك دابا 🤰"
        formSubtitle="الاسم الكامل، رقم الهاتف، والمدينة أو العنوان — وغادي نتاصلو بك للتأكيد."
        submitLabel={`🤰 اطلبي بـ ${formatPriceNumber(PRICE, "ar")} درهم`}
        fullNamePlaceholder="الاسم الكامل"
        addressLabel="المدينة أو العنوان"
        addressPlaceholder="مثال: الدار البيضاء — الحي، الشارع، رقم المنزل"
        summaryRows={[
          { label: "المنتج", value: "حزام دعم الحمل" },
          { label: "الهدية", value: "ميزان حرارة رقمي — مجاني 🎁" },
          { label: "الإجمالي", value: `${formatPriceNumber(PRICE, "ar")} درهم` },
        ]}
        orderNote={`حزام دعم الحمل | ${PRICE} | هدية ميزان حرارة`}
      />
      <p className="text-center text-sm text-rose-900/65">💵 خلّصي غير ملي توصلك الطلبية</p>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#fff5f7] via-[#fdf2f8] to-[#fce7f3] text-[#4a1942] font-sans w-full max-w-full overflow-x-clip pb-24"
      dir="rtl"
    >
      <div className="bg-[#831843] text-[#fce7f3] text-xs sm:text-sm py-2.5 px-4">
        <div className="max-w-lg mx-auto flex flex-wrap justify-center gap-x-5 gap-y-1 text-center">
          <span className="flex items-center gap-1.5">
            <Gift className="h-3.5 w-3.5" /> 🎁 ميزان حرارة هدية مع كل طلب
          </span>
          <span className="hidden sm:inline opacity-30">|</span>
          <span className="flex items-center gap-1.5">
            <Banknote className="h-3.5 w-3.5" /> 💵 الدفع عند الاستلام
          </span>
          <span className="hidden sm:inline opacity-30">|</span>
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> 🚚 توصيل مجاني
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-rose-200/80 bg-[#fff5f7]/95 backdrop-blur-md">
        <div className="max-w-lg mx-auto flex items-center h-12 px-3">
          <Link
            href="/ar"
            className="flex items-center gap-1 text-sm text-rose-900/70 hover:text-[#4a1942]"
            aria-label="رجوع للمتجر"
          >
            <ChevronLeft className="h-5 w-5" />
            NOORVA
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 sm:px-5 space-y-12 sm:space-y-14 pt-6">
        <section className="space-y-5 text-center">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-800">
              <Baby className="h-3.5 w-3.5" /> للحوامل — راحة ودعم في كل خطوة
            </p>
            <h1 className="text-2xl sm:text-[1.65rem] font-bold leading-snug text-[#4a1942]">
              حزام دعم الحمل القابل للتعديل
              <br />
              <span className="text-rose-700">لدعم البطن والظهر</span>
            </h1>
            <p className="text-base text-rose-950/75 leading-relaxed">
              أمومة أكثر راحة ❤️ — دعم أسفل البطن، وضعية أحسن، ومع الطلب{" "}
              <strong className="text-rose-800">ميزان حرارة رقمي هدية</strong>.
            </p>
          </div>

          <ImageSlot
            src={infographicSrc}
            alt="تعبتي من ثقل الكرش؟ ارتاحي مع حزام الدعم NOORVA"
            priority
            sizes="(max-width: 512px) 100vw, 512px"
          />

          <div className="space-y-1">
            <p className="text-3xl font-black tabular-nums text-rose-700">
              {formatPriceNumber(PRICE, "ar")}{" "}
              <span className="text-lg font-bold text-[#4a1942]">درهم</span>
            </p>
            <p className="text-sm text-rose-900/60">
              <span className="line-through">{formatPriceNumber(COMPARE, "ar")} درهم</span> · حزام + هدية
            </p>
            {product.reviewCount > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-sm">
                <StarRow rating={product.rating} />
                <span className="font-semibold tabular-nums">{product.rating.toFixed(1)}</span>
                <span className="text-rose-900/60">({product.reviewCount} تقييم)</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={scrollToOrder}
            className="w-full min-h-[3.25rem] rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base shadow-lg shadow-rose-600/25 transition-colors"
          >
            🤰 اطلبي بـ {formatPriceNumber(PRICE, "ar")} درهم — هدية مجانية
          </button>
        </section>

        <section
          id="order-form"
          className="scroll-mt-20 -mt-4 rounded-3xl border-2 border-rose-300/40 bg-white/80 backdrop-blur-sm p-4 sm:p-5 shadow-xl shadow-rose-900/8"
        >
          {orderFormBlock}
        </section>

        {gift && (
          <section
            id="free-gift"
            className="overflow-hidden rounded-3xl border-2 border-amber-300/50 bg-gradient-to-br from-amber-50 via-white to-rose-50 shadow-md"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,160px)_1fr] gap-0">
              <div className="relative aspect-square sm:aspect-auto sm:min-h-[200px] bg-white border-b sm:border-b-0 sm:border-s border-rose-100">
                <Image
                  src={giftSrc}
                  alt={gift.giftTitle.ar}
                  fill
                  sizes="(max-width: 640px) 50vw, 160px"
                  loading="lazy"
                  className="object-contain p-3"
                />
              </div>
              <div className="p-5 sm:p-6 space-y-2 text-start">
                <p className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-amber-950">
                  <Gift className="h-3.5 w-3.5" /> هدية مجانية — 0 درهم
                </p>
                <h2 className="text-xl font-bold text-[#4a1942] leading-snug">
                  ميزان حرارة رقمي سريع القياس 🌡️
                </h2>
                <p className="text-sm text-rose-950/75 leading-relaxed">{gift.giftDescription?.ar}</p>
                <ul className="text-sm space-y-1 text-rose-900/80">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                    قراءة سريعة على شاشة LCD
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                    سهل الاستعمال فالدار
                  </li>
                  <li className="flex items-start gap-2">
                    <Thermometer className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                    مفيد لتتبع الحرارة وقت الحمل
                  </li>
                </ul>
                <p className="text-sm font-semibold text-emerald-700">{gift.giftDisclosure.ar}</p>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-rose-200 bg-white p-6 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-center">واش هاد الحزام ليك؟</h2>
          <p className="text-sm leading-relaxed text-rose-950/80 text-center">
            إلا كتحسي بضغط على الظهر، ثقل فأسفل البطن، أو تعب فالمشي — الحزام كيعطيك دعم ملموس من غير ما
            يوقفك على الحياة اليومية.
          </p>
          <ul className="space-y-2 text-sm">
            {[
              "بطن كيكبر وكتحسّي بغيتي دعم",
              "آلام خفيفة فالظهر أو الحوض",
              "بغيتي تمشي وتخدمي براحة أكثر",
              "بغيتي هدية عملية مع الطلب (ميزان حرارة)",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2 rounded-xl bg-rose-50/80 px-3 py-2">
                <Check className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                {line}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-center">المميزات اللي كتفرق</h2>
          <div className="grid grid-cols-1 gap-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="flex gap-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                  <b.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-[#4a1942]">{b.title}</p>
                  <p className="text-sm text-rose-950/70 mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <ImageSlot
            src={featuresSrc}
            alt="مميزات حزام دعم الحمل — بطن، ظهر، قماش، تعديل"
            aspect="aspect-[4/5]"
            sizes="(max-width: 512px) 100vw, 480px"
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-center">كيفاش تلبسيه؟</h2>
          <ol className="space-y-3">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="flex gap-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-sm font-black text-white">
                  {s.n}
                </span>
                <div>
                  <p className="font-bold">{s.title}</p>
                  <p className="text-sm text-rose-950/70">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="grid grid-cols-1 gap-3">
            <ImageSlot
              src={inUseSrc}
              alt="دعم الظهر — منظر خلفي للحزام"
              aspect="aspect-[4/3]"
              sizes="(max-width: 512px) 100vw, 480px"
            />
            <ImageSlot
              src={lifestyleSrc}
              alt="حامله مرتاحة فالدار مع حزام الدعم"
              aspect="aspect-[4/3]"
              sizes="(max-width: 512px) 100vw, 480px"
            />
          </div>
          <p className="text-xs text-center text-rose-900/55">
            ⚕️ هاد المنتج دعم راحة وليس بديلاً عن استشارة الطبيب أو القابلة.
          </p>
        </section>

        <section className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6 space-y-3">
          <h2 className="text-xl font-bold text-center">متى تستعمليه؟</h2>
          {TRIMESTERS.map((t) => (
            <div key={t.label} className="rounded-xl bg-white border border-rose-100 px-4 py-3">
              <p className="font-bold text-rose-800">{t.label}</p>
              <p className="text-sm text-rose-950/75">{t.desc}</p>
            </div>
          ))}
        </section>

        {reviews.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-center">آراء الأمهات</h2>
            <div className="space-y-3">
              {reviews.map((r) => (
                <article
                  key={r.id}
                  className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm text-start"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <StarRow rating={r.rating} />
                    {r.verified && (
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        ✓ طلب مؤكد
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-[#4a1942]">{r.title.ar}</p>
                  <p className="text-sm text-rose-950/75 mt-2 leading-relaxed">{r.content.ar}</p>
                  <p className="text-xs text-rose-900/50 mt-3">
                    {r.author} · {r.city}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-3xl border-2 border-rose-400/30 bg-gradient-to-b from-white to-rose-50 p-6 text-center space-y-4 shadow-lg">
          <p className="text-lg font-bold">العرض: {formatPriceNumber(PRICE, "ar")} درهم</p>
          <p className="text-sm text-rose-950/75">حزام دعم + ميزان حرارة هدية · COD · توصيل مجاني</p>
          <button
            type="button"
            onClick={scrollToOrder}
            className="w-full min-h-[3.25rem] rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base shadow-lg shadow-rose-600/25"
          >
            اطلبي دابا 🤰
          </button>
        </section>

        <Accordion type="single" collapsible className="rounded-2xl border border-rose-200 bg-white px-4">
          <p className="pt-4 pb-2 text-center font-bold">أسئلة شائعة</p>
          {MATERNITY_BELT_FAQS.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-start text-sm font-semibold">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-rose-950/75 leading-relaxed">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>

      {showSticky && (
        <div className="fixed bottom-0 inset-x-0 z-50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#fff5f7] via-[#fff5f7] to-transparent animate-in slide-in-from-bottom-4 duration-200">
          <div className="max-w-lg mx-auto">
            <button
              type="button"
              onClick={scrollToOrder}
              className="w-full min-h-[3.25rem] rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base shadow-xl shadow-rose-600/30"
            >
              🤰 {formatPriceNumber(PRICE, "ar")} درهم + هدية · اطلبي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
