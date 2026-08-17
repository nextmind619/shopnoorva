"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  Shield,
  Truck,
  Banknote,
  ShoppingBag,
  Check,
  Sun,
  PenLine,
  Eraser,
  Calculator,
  GraduationCap,
  Briefcase,
  Building2,
  BookOpen,
  UserRound,
  Sparkles,
} from "lucide-react";
import type { Product } from "@/types";
import { moroccanCities } from "@/data/products";
import { FacebookProductTracker } from "@/components/facebook/facebook-trackers";
import { formatPriceNumber, calculateDiscount, cn } from "@/lib/utils";
import { resolveProductImage } from "@/lib/product-images/resolve";
import { PremiumProductGallery } from "@/components/product/product-gallery-premium";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ProductOrderForm = dynamic(
  () => import("@/components/product/product-order-form").then((m) => m.ProductOrderForm),
  { ssr: true, loading: () => <div className="min-h-[420px]" aria-hidden /> },
);

const SLUG = "solar-calculator-lcd-notepad";
const CTA = "اطلبها دابا";
const CTA_OFFER = "استافد من العرض دابا";

export const CALCULATOR_FAQS = [
  {
    q: "واش كتخدم بالطاقة الشمسية؟",
    a: "نعم. فيها لوحة شمسية فوق شاشة الحاسبة، وتشغيل مزدوج للاستخدام اليومي.",
  },
  {
    q: "واش فيها لوح للكتابة؟",
    a: "نعم. لوح كتابة إلكتروني مدمج على يمين الحاسبة، تقدر تكتب عليه الملاحظات والحسابات.",
  },
  {
    q: "واش كيجي معها القلم؟",
    a: "نعم. كيجي معها قلم Stylus باش تكتب على اللوح.",
  },
  {
    q: "واش نقدر نمسح الكتابة؟",
    a: "نعم. تقدر تمسح الكتابة بسهولة من اللوح وتعاود تكتب من جديد.",
  },
  {
    q: "واش مناسبة للتلاميذ والطلبة؟",
    a: "نعم. مناسبة للتلاميذ والطلبة والأساتذة — حساب وتمارين وملاحظات فـ جهاز واحد.",
  },
  {
    q: "واش نقدر نستعملها فالخدمة؟",
    a: "نعم. مناسبة للموظفين وأصحاب المكاتب وأي شخص كيدير الحسابات يومياً.",
  },
  {
    q: "شحال مدة التوصيل؟",
    a: "24–48 ساعة للمدن الكبرى، و2–4 أيام لباقي المدن. التوصيل لجميع مدن المغرب.",
  },
  {
    q: "واش كاين الدفع عند الاستلام؟",
    a: "نعم. الدفع عند الاستلام فقط. ما كخلص والو دابا — كتخلص كاش ملي توصلك الطلبية.",
  },
  {
    q: "واش التوصيل مجاني؟",
    a: "نعم، التوصيل مجاني لجميع مدن المغرب.",
  },
];

const BENEFITS = [
  {
    title: "حساب وكتابة فـ نفس الجهاز",
    desc: "ما بقيتش محتاج ورقة جنب الحاسبة. كلشي مجموعين قدامك.",
    icon: Calculator,
  },
  {
    title: "لوح كتابة إلكتروني مدمج",
    desc: "كتب التمارين، الرسوم، والملاحظات مباشرة على اللوح.",
    icon: BookOpen,
  },
  {
    title: "قلم للكتابة السريعة",
    desc: "القلم كيجي معها. كتب، مسّح، وعاود بلا ما تبحث على قلم آخر.",
    icon: PenLine,
  },
  {
    title: "مسح ساهل بلا أوراق ضايعة",
    desc: "خلّص من القصيصات الصغيرة اللي كتضيع فوق المكتب.",
    icon: Eraser,
  },
  {
    title: "تصميم عملي للدراسة والعمل",
    desc: "خفيفة، واضحة، ومناسبة للمحفظة والمكتب.",
    icon: Briefcase,
  },
  {
    title: "طاقة شمسية للاستخدام اليومي",
    desc: "اللوحة الشمسية كتخليك تستعملها فالقراءة والضوء الطبيعي.",
    icon: Sun,
  },
];

const AUDIENCE = [
  { icon: GraduationCap, title: "تلميذ", desc: "تمارين وحساب بلا ما تضيّع الأوراق." },
  { icon: BookOpen, title: "طالب", desc: "ملاحظات سريعة أثناء الدراسة والمراجعة." },
  { icon: UserRound, title: "أستاذ", desc: "شرح، حساب، وكتابة فوق المكتب." },
  { icon: Briefcase, title: "موظف", desc: "حسابات يومية وملاحظات منظمة." },
  { icon: Building2, title: "صاحب مكتب", desc: "جهاز واحد فوق المكتب بدل جوج أدوات." },
  { icon: Calculator, title: "كتحسب يومياً", desc: "إلا الحساب جزء من يومك، هاد الجهاز ليك." },
];

const PROBLEMS = [
  "آلة حاسبة عادية ما فيهاش بلاصة للملاحظات",
  "خاصك ورقة وقلم جنب كل حساب",
  "الأوراق الصغيرة كتضيع فوق المكتب",
  "بزاف ديال الأدوات قدامك",
  "كتب، تمسح، وتعاود من الصفر كل مرة",
];

interface Props {
  product: Product;
}

function CtaButton({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full h-14 sm:h-16 rounded-2xl bg-[#0f766e] hover:bg-[#0d9488] text-white font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-teal-700/25 transition-colors",
        className,
      )}
    >
      <ShoppingBag className="h-5 w-5" />
      {children}
    </button>
  );
}

export function ProductPageSolarCalculator({ product }: Props) {
  const variant = product.variants[0];
  const price = variant.price;
  const compareAt = variant.compareAtPrice && variant.compareAtPrice > price ? variant.compareAtPrice : undefined;
  const discount = calculateDiscount(price, compareAt);
  const [sticky, setSticky] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const formSentinel = useRef<HTMLDivElement>(null);

  const scrollToOrder = useCallback(() => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 380);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = formSentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), {
      threshold: 0.12,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const heroSrc = resolveProductImage(SLUG, "02-premium-hero", "webp");
  const deskSrc = resolveProductImage(SLUG, "03-lifestyle", "webp");
  const closeSrc = resolveProductImage(SLUG, "09-close-up", "webp");
  const showSticky = sticky && !formVisible;

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#1c2333] font-sans w-full max-w-full overflow-x-clip" dir="rtl">
      <FacebookProductTracker
        productId={product.id}
        contentName={product.name.ar}
        value={price}
        currency="MAD"
        quantity={1}
      />

      <div className="bg-[#0f766e] text-white text-xs sm:text-sm py-2.5 px-4">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-x-5 gap-y-1 text-center">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-200" /> عرض الإطلاق
          </span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> الشحن مجاني
          </span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="flex items-center gap-1.5">
            <Banknote className="h-3.5 w-3.5 text-emerald-200" /> الدفع عند الاستلام
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-28 lg:pb-16 pt-4 space-y-10 sm:space-y-12 min-w-0 w-full">
        <nav className="flex items-center gap-2 text-xs text-[#5b6578]">
          <Link href="/ar" className="hover:text-[#0f766e] transition-colors">
            نورڤا
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <Link href="/ar/products" className="hover:text-[#0f766e] transition-colors">
            المجموعة
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <span className="font-medium truncate text-[#1c2333]">{product.name.ar}</span>
        </nav>

        <section className="text-center space-y-4">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
            🔥 عرض الإطلاق
          </p>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">
            الحساب والكتابة فـ جهاز واحد!
          </h1>
          <p className="text-base sm:text-lg text-[#5b6578] leading-relaxed max-w-xl mx-auto">
            آلة حاسبة كبيرة وواضحة + لوح كتابة إلكتروني + قلم. للطالب، الأستاذ، والمكتب.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-[#5b6578]">
            <span className="inline-flex items-center gap-1 rounded-full bg-white border border-[#e6eaef] px-3 py-1">
              الشحن مجاني 🚚
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white border border-[#e6eaef] px-3 py-1">
              الدفع عند الاستلام
            </span>
          </div>
        </section>

        <section aria-label="صور المنتج">
          <PremiumProductGallery product={product} />
        </section>

        <section className="rounded-3xl border border-teal-200/70 bg-white p-5 sm:p-7 text-center space-y-4 shadow-sm">
          <p className="text-sm font-bold text-[#0f766e]">الثمن اليوم — عرض الإطلاق</p>
          {compareAt && (
            <p className="text-sm text-[#8b93a3]">
              السعر قبل:{" "}
              <span className="line-through decoration-[#8b93a3]">
                {formatPriceNumber(compareAt, "ar")} درهم
              </span>
            </p>
          )}
          <p className="text-4xl sm:text-5xl font-black tabular-nums text-[#0f766e] leading-none">
            {formatPriceNumber(price, "ar")}{" "}
            <span className="text-xl font-bold text-[#1c2333]">درهم</span>
          </p>
          {discount > 0 && (
            <p className="text-sm font-semibold text-emerald-700">توفير {discount}% فـ عرض الإطلاق</p>
          )}
          <p className="text-base font-bold text-[#1c2333]">التوصيل مجاني 🚚</p>
          <CtaButton onClick={scrollToOrder}>{CTA_OFFER}</CtaButton>
          <p className="text-xs text-[#8b93a3]">العرض متوفر خلال فترة الإطلاق فقط</p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {[
            { icon: Banknote, label: "الدفع عند الاستلام" },
            { icon: Truck, label: "الشحن مجاني" },
            { icon: Shield, label: "ضمان 12 شهر" },
            { icon: Sun, label: "طاقة شمسية" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-2xl border border-[#e6eaef] bg-white px-3 py-3 shadow-sm"
            >
              <item.icon className="h-4 w-4 text-[#0f766e] shrink-0" />
              <span className="text-xs font-semibold">{item.label}</span>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-5 sm:p-7 space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-center">🔥 عرض الإطلاق لفترة محدودة</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white border border-[#e6eaef] p-4 text-center">
              <p className="text-xs text-[#8b93a3] mb-1">السعر قبل</p>
              <p className="text-lg font-bold text-[#8b93a3] line-through tabular-nums">
                {formatPriceNumber(compareAt ?? price, "ar")} درهم
              </p>
            </div>
            <div className="rounded-2xl bg-white border-2 border-[#0f766e] p-4 text-center">
              <p className="text-xs text-[#0f766e] mb-1">السعر اليوم</p>
              <p className="text-lg sm:text-xl font-black text-[#0f766e] tabular-nums">
                {formatPriceNumber(price, "ar")} درهم
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            {["التوصيل مجاني لباب دارك", "الدفع عند الاستلام", "العرض متوفر خلال فترة الإطلاق فقط"].map((line) => (
              <li key={line} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#0f766e] shrink-0" />
                {line}
              </li>
            ))}
          </ul>
          <CtaButton onClick={scrollToOrder}>{CTA}</CtaButton>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-center">علاش تستعمل جوج أدوات؟</h2>
          <p className="text-center text-[#5b6578] text-sm sm:text-base leading-relaxed">
            الحاسبة العادية كتحسب فقط. إلا بغيتي تكتب، خاصك ورقة وقلم… وبعدين الورقة كتضيع.
          </p>
          <div className="rounded-3xl border border-[#e6eaef] bg-white overflow-hidden shadow-sm">
            <ul className="divide-y divide-[#eef1f4]">
              {PROBLEMS.map((item) => (
                <li key={item} className="flex items-start gap-3 px-4 py-3.5 text-sm">
                  <span className="mt-0.5 text-red-500 font-black" aria-hidden>
                    ✕
                  </span>
                  <span className="text-[#3d4554]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-teal-200 bg-teal-50/70 p-5 text-center space-y-2">
            <p className="text-lg sm:text-xl font-black text-[#0f766e] leading-snug">
              علاش تستعمل جوج أدوات وانت تقدر تجمعهم فـ جهاز واحد؟
            </p>
            <p className="text-sm text-[#3d4554]">آلة حاسبة + لوح كتابة + قلم. حل واحد فوق المكتب.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-center">علاش غادي يعجبك؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl border border-[#e6eaef] bg-white p-4 shadow-sm">
                <b.icon className="h-5 w-5 text-[#0f766e] mb-2" />
                <p className="font-bold">☑️ {b.title}</p>
                <p className="text-sm text-[#5b6578] mt-1 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-center">مناسب ليك إلا كنت...</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AUDIENCE.map((a) => (
              <div
                key={a.title}
                className="rounded-2xl border border-[#e6eaef] bg-white p-4 text-center shadow-sm"
              >
                <a.icon className="h-6 w-6 text-[#0f766e] mx-auto mb-2" />
                <p className="font-bold text-sm">{a.title}</p>
                <p className="text-xs text-[#5b6578] mt-1 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-center">كيفاش كتستعمل؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-[#e6eaef] bg-white">
              <Image
                src={deskSrc}
                alt="آلة حاسبة مع لوح كتابة فوق مكتب للدراسة"
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-[#e6eaef] bg-white">
              <Image
                src={closeSrc}
                alt="كتابة بالقلم على اللوح الإلكتروني للآلة الحاسبة"
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
          <ol className="space-y-3">
            {[
              { n: "1", t: "شغّل الحاسبة", d: "اضغط ON/AC وابدأ الحساب على الأزرار الواضحة." },
              { n: "2", t: "كتب على اللوح", d: "خذ القلم وسجّل التمرين أو الملاحظة على اللوح الإلكتروني." },
              { n: "3", t: "مسح وعاود", d: "مسح الكتابة بسهولة وكمّل خدمتك بلا ورقة." },
            ].map((s) => (
              <li key={s.n} className="flex gap-3 rounded-2xl border border-[#e6eaef] bg-white p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-white font-black">
                  {s.n}
                </span>
                <div>
                  <p className="font-bold">{s.t}</p>
                  <p className="text-sm text-[#5b6578] mt-1">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-relaxed space-y-2">
          <p className="font-bold text-emerald-800">🚚 التوصيل لباب دارك</p>
          <p className="text-[#3d4554]">مجاني لجميع مدن المغرب. 24–48 ساعة للمدن الكبرى.</p>
          <p className="font-bold text-emerald-800 pt-1">💵 خلّص عند الاستلام</p>
          <p className="text-[#3d4554]">ما كخلص والو دابا. كتخلص كاش ملي توصلك الطلبية.</p>
        </div>

        <div ref={formSentinel}>
          <div className="mb-3 space-y-1 text-center">
            <p className="font-black text-lg">🚚 التوصيل لباب دارك</p>
            <p className="font-bold text-[#0f766e]">💵 خلّص عند الاستلام</p>
          </div>
          <ProductOrderForm
            product={product}
            variant={variant}
            quantity={1}
            extendedAddress
            cityOptions={moroccanCities}
            fullNamePlaceholder="مثال: محمد أمين"
            formTitle="اطلبها دابا — الدفع عند الاستلام"
            formSubtitle="عمّر الاسم، الهاتف، المدينة والعنوان. ما كخلص والو حتى توصلك الطلبية."
            submitLabel={CTA}
            summaryRows={[
              { label: "المنتج", value: product.name.ar },
              { label: "العرض", value: "عرض الإطلاق" },
              { label: "السعر", value: `${formatPriceNumber(price, "ar")} DH` },
            ]}
            orderNote="عرض الإطلاق | آلة حاسبة مع لوح كتابة"
          />
        </div>

        <section className="rounded-3xl border border-[#e6eaef] bg-white p-5 sm:p-7 space-y-3">
          <h2 className="text-xl font-black text-center">شنو قالو الناس اللي جربوها؟</h2>
          <p className="text-sm text-[#5b6578] text-center leading-relaxed">
            هاد المنتج فـ عرض الإطلاق. أول الزبناء غادي يشاركو تجربتهم هنا بعد الاستلام.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { t: "خلص غير ملي توصلك", d: "الدفع عند الاستلام. بلا بطاقة بنكية." },
              { t: "تقدر ترجع عند العيب", d: "تواصل معنا على واتساب إذا كان عيب مصنعي." },
              { t: "ضمان 12 شهر", d: "تغطية عيوب التصنيع بعد الاستلام." },
            ].map((card) => (
              <div key={card.t} className="rounded-2xl border border-[#e6eaef] bg-[#f8fafb] p-4">
                <p className="font-bold text-sm">{card.t}</p>
                <p className="text-xs text-[#5b6578] mt-1 leading-relaxed">{card.d}</p>
              </div>
            ))}
          </div>
        </section>

        <Accordion type="single" collapsible className="rounded-2xl border border-[#e6eaef] bg-white px-4">
          <AccordionItem value="details">
            <AccordionTrigger>تفاصيل المنتج</AccordionTrigger>
            <AccordionContent className="text-[#5b6578] text-sm leading-relaxed">
              {product.deepDescription?.ar}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="howto">
            <AccordionTrigger>طريقة الاستخدام</AccordionTrigger>
            <AccordionContent className="text-[#5b6578] text-sm leading-relaxed">{product.howToUse?.ar}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="box">
            <AccordionTrigger>شنو كيجي فالعلبة؟</AccordionTrigger>
            <AccordionContent className="text-[#5b6578] text-sm">
              <ul className="space-y-2">
                {(product.packageIncludes || []).map((item) => (
                  <li key={item.ar} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#0f766e]" /> {item.ar}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq">
            <AccordionTrigger>الأسئلة الشائعة</AccordionTrigger>
            <AccordionContent className="text-[#5b6578] text-sm space-y-4">
              {CALCULATOR_FAQS.map((faq) => (
                <div key={faq.q}>
                  <p className="font-bold text-[#1c2333]">{faq.q}</p>
                  <p className="mt-1">{faq.a}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <section className="rounded-3xl border border-[#0f766e]/20 bg-white overflow-hidden shadow-sm">
          <div className="relative aspect-square bg-[#eef3f3]">
            <Image
              src={heroSrc}
              alt="آلة حاسبة إلكترونية مع لوح كتابة إلكتروني وقلم"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          <div className="p-6 sm:p-8 text-center space-y-3">
            <h2 className="text-xl sm:text-2xl font-black leading-snug">
              ما تبقاش محتاج الورقة والقلم والحاسبة بوحدهم...
            </h2>
            <p className="text-[#5b6578]">خلي الحساب والكتابة مجموعين فـ جهاز واحد.</p>
            <p className="text-3xl font-black tabular-nums text-[#0f766e]">
              {formatPriceNumber(price, "ar")} درهم
            </p>
            <p className="text-sm font-semibold">التوصيل مجاني · الدفع عند الاستلام</p>
            <CtaButton onClick={scrollToOrder}>🔥 اطلبها دابا واستافد من عرض الإطلاق</CtaButton>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 88 }}
            animate={{ y: 0 }}
            exit={{ y: 88 }}
            className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-[#e6eaef] safe-area-pb shadow-[0_-8px_24px_rgba(15,23,42,0.08)]"
          >
            <div className="px-4 py-3 max-w-lg mx-auto flex items-center gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#5b6578] truncate">حاسبة + لوح كتابة</p>
                <p className="text-sm font-black tabular-nums text-[#0f766e]">
                  {formatPriceNumber(price, "ar")} درهم
                </p>
              </div>
              <button
                type="button"
                onClick={scrollToOrder}
                className="flex-1 h-12 rounded-xl bg-[#0f766e] hover:bg-[#0d9488] text-white font-black text-sm"
              >
                اطلب دابا
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
