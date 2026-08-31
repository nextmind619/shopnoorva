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
  Palette,
  Briefcase,
  Gift,
  Baby,
  GraduationCap,
  Sparkles,
  LayoutGrid,
  Paintbrush,
  MonitorOff,
} from "lucide-react";
import type { Product } from "@/types";
import { moroccanCities } from "@/data/products";
import { FacebookProductTracker } from "@/components/facebook/facebook-trackers";
import { formatPriceNumber, cn } from "@/lib/utils";
import { resolveProductImage } from "@/lib/product-images/resolve";
import { PremiumProductGallery } from "@/components/product/product-gallery-premium";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ProductOrderForm = dynamic(
  () => import("@/components/product/product-order-form").then((m) => m.ProductOrderForm),
  { ssr: true, loading: () => <div className="min-h-[420px]" aria-hidden /> },
);

const SLUG = "kids-art-set-easel-208";
const GIFT_IMAGE = "/products/kids-art-set-easel-208/arabic-magic-book-gift.jpg";
const CTA_ORDER = "🛒 أطلب الآن بـ299 DH";
const CTA_ORDER_GIFT = "🛒 أطلب الآن بـ299 DH + الهدية مجانية";
const CTA_OFFER = "أطلب العرض الآن 🎁";

export const KIDS_ART_FAQS = [
  {
    q: "شحال عدد القطع؟",
    a: "208 قطعة داخل حقيبة وحدة: ماركر، أقلام تلوين، ألوان شمع، باستيل، ألوان مائية، فرشاة، ممحاة ومبراة.",
  },
  {
    q: "واش فيه حامل رسم؟",
    a: "نعم. حامل أبيض ينفتح فالوسط مع كلابين أسودين باش تثبّت الورقة وهو كيرسم.",
  },
  {
    q: "لمن مناسب؟",
    a: "مناسب للأطفال من سن الروض والابتدائي — هدية لعيد الميلاد، الدخول المدرسي، أو وقت الفراغ فالدار.",
  },
  {
    q: "واش كيتفرّق الألوان؟",
    a: "لا. كل أداة عندها تجويف مقولب. منين يسالي الرسم، كيرجع كل لون لبلاصتو وطاوي الحقيبة.",
  },
  {
    q: "واش كاتطوى؟",
    a: "نعم. حقيبة بلاستيك زرقاء قابلة للطي بمقبض. كتفتح لستوديو وكتطوى باش تتخزّن أو تسافر.",
  },
  {
    q: "شنو كيجي فالعلبة؟",
    a: "مجموعة الرسم والتلوين (208 قطعة مع حامل) + Arabic Magic Book هدية مجانية (4 كتب تعليمية + قلم سحري).",
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
    title: "ستوديو كامل فحقيبة وحدة",
    desc: "208 قطعة: ما بقيتش تشري أقلام وحدهم وحامل وحدو.",
    icon: Briefcase,
  },
  {
    title: "حامل رسم ينفتح",
    desc: "حامل أبيض مع كلابات. الورقة ثابتة وهو كيرسم بتركيز.",
    icon: LayoutGrid,
  },
  {
    title: "كل لون فبلاصتو",
    desc: "تجاويف مقولبة. كيطوي الحقيبة والفوضى كتسالي.",
    icon: Palette,
  },
  {
    title: "ساعات بلا شاشات",
    desc: "الرسم كيخلي الولد منشغل ومبدع بدل التابلت.",
    icon: MonitorOff,
  },
  {
    title: "ماركر، أقلام، شمع ومائي",
    desc: "أدوات متنوعة باش يجرب تقنيات مختلفة فنفس الطقم.",
    icon: Paintbrush,
  },
  {
    title: "هدية جاهزة",
    desc: "عيد ميلاد، دخول مدرسي، أو مفاجأة. كتوصل معلّبة.",
    icon: Gift,
  },
];

const AUDIENCE = [
  { icon: Baby, title: "أم / أب", desc: "بغيتي نشاط منظم فالدار بلا فوضى." },
  { icon: Gift, title: "هدية", desc: "عيد ميلاد أو عيد — هدية كتخدم بزاف." },
  { icon: GraduationCap, title: "دخول مدرسي", desc: "كل أدوات الرسم مجموعين للمحفظة والدار." },
  { icon: Palette, title: "ولد كيبغي يرسم", desc: "حامل وألوان جاهزين فوق الطاولة." },
  { icon: MonitorOff, title: "بدل الشاشات", desc: "وقت إبداع بدل التابلت والفيديو." },
  { icon: Sparkles, title: "حضانة وابتدائي", desc: "مناسب للصغار اللي بداو التلوين." },
];

const PROBLEMS = [
  "الأقلام والألوان كيتفرّقو فوق الطاولة وفالأدراج",
  "كتشري أدوات وحدهم وما عندوش حامل رسم",
  "الولد كيمل بسرعة وكيرجع للشاشة",
  "ما كاينش بلاصة منظمة لكل لون",
  "الهدية كتولي علبة فارغة من بعد أسبوع",
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
        "w-full h-14 sm:h-16 rounded-2xl bg-[#0891b2] hover:bg-[#0e7490] text-white font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-700/25 transition-colors",
        className,
      )}
    >
      <ShoppingBag className="h-5 w-5" />
      {children}
    </button>
  );
}

export function ProductPageKidsArtSet({ product }: Props) {
  const variant = product.variants[0];
  const price = variant.price;
  const priceLabel = `${formatPriceNumber(price, "ar")} DH`;
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
  const inUseSrc = resolveProductImage(SLUG, "14-product-in-use", "webp");
  const closeSrc = resolveProductImage(SLUG, "09-close-up", "webp");
  const featuresSrc = resolveProductImage(SLUG, "10-features", "webp");
  const kidsRoomSrc = resolveProductImage(SLUG, "08-kids-room", "webp");
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

      <div className="bg-[#0891b2] text-white text-xs sm:text-sm py-2.5 px-4">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-x-5 gap-y-1 text-center">
          <span className="flex items-center gap-1.5">
            <Gift className="h-3.5 w-3.5 text-amber-200" /> Arabic Magic Book هدية مجانية
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
          <Link href="/ar" className="hover:text-[#0891b2] transition-colors">
            نورڤا
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <Link href="/ar/products" className="hover:text-[#0891b2] transition-colors">
            المجموعة
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <span className="font-medium truncate text-[#1c2333]">{product.name.ar}</span>
        </nav>

        <section className="text-center space-y-5">
          <div className="space-y-2">
            <p className="text-lg sm:text-xl font-black text-[#1c2333]">🎨 مجموعة الرسم والتلوين للأطفال</p>
            <p className="text-2xl font-black text-[#0891b2]">+</p>
            <p className="text-lg sm:text-xl font-black text-[#1c2333]">🎁 Arabic Magic Book مجاناً</p>
          </div>
          <p className="text-4xl sm:text-5xl font-black tabular-nums leading-none text-[#0891b2]">
            🔥 {priceLabel} <span className="text-xl sm:text-2xl">فقط</span>
          </p>
          <p className="text-sm text-[#5b6578]">🎁 Arabic Magic Book هدية مجانية مع الطلب</p>
          <CtaButton onClick={scrollToOrder}>{CTA_ORDER_GIFT}</CtaButton>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-[#5b6578]">
            <span className="inline-flex items-center gap-1 rounded-full bg-white border border-[#e6eaef] px-3 py-1">
              🚚 الدفع عند الاستلام
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white border border-[#e6eaef] px-3 py-1">
              ⚡ تأكيد الطلب
            </span>
          </div>
        </section>

        <section aria-label="صور المنتج">
          <PremiumProductGallery product={product} />
        </section>

        <section className="grid grid-cols-2 gap-3">
          {[
            { icon: Banknote, label: "الدفع عند الاستلام" },
            { icon: Truck, label: "الشحن مجاني" },
            { icon: Shield, label: "ضمان 12 شهر" },
            { icon: Palette, label: "208 قطعة" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-2xl border border-[#e6eaef] bg-white px-3 py-3 shadow-sm"
            >
              <item.icon className="h-4 w-4 text-[#0891b2] shrink-0" />
              <span className="text-xs font-semibold">{item.label}</span>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-5 sm:p-7 space-y-5">
          <h2 className="text-xl sm:text-2xl font-black text-center">شنو غادي تاخد بـ{priceLabel}؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white border border-[#e6eaef] overflow-hidden shadow-sm">
              <div className="relative aspect-square bg-[#eef6f8]">
                <Image
                  src={heroSrc}
                  alt="مجموعة الرسم والتلوين للأطفال 208 قطعة مع حامل مدمج"
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center space-y-1">
                <p className="font-black text-base">🎨 مجموعة الرسم والتلوين</p>
                <p className="text-xs text-[#5b6578]">القيمة الأساسية للعرض</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white border-2 border-emerald-400 overflow-hidden shadow-sm relative">
              <span className="absolute top-3 start-3 z-10 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-bold text-white">
                هدية مجانية 🎁
              </span>
              <div className="relative aspect-square bg-white">
                <Image
                  src={GIFT_IMAGE}
                  alt="Arabic Magic Book — 4 كتب تعليمية مع قلم سحري"
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-contain p-3"
                />
              </div>
              <div className="p-4 text-center space-y-1">
                <p className="font-black text-base">🎁 Arabic Magic Book</p>
                <p className="text-xs text-emerald-700 font-semibold">هدية مجانية مع الطلب</p>
              </div>
            </div>
          </div>
          <p className="text-center text-2xl sm:text-3xl font-black tabular-nums text-[#0891b2]">
            🔥 العرض كامل بـ{priceLabel} فقط
          </p>
          <CtaButton onClick={scrollToOrder}>{CTA_OFFER}</CtaButton>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-center">علاش الرسم كيتفرّق فالدار؟</h2>
          <p className="text-center text-[#5b6578] text-sm sm:text-base leading-relaxed">
            كتشري أقلام وحدهم. ما كاينش حامل. والولد كيمل وكيرجع للشاشة.
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
          <div className="rounded-3xl border border-cyan-200 bg-cyan-50/70 p-5 text-center space-y-2">
            <p className="text-lg sm:text-xl font-black text-[#0891b2] leading-snug">
              ستوديو كامل: حامل + 208 قطعة + كل لون فبلاصتو
            </p>
            <p className="text-sm text-[#3d4554]">كيفتح، كيرسم، وطاوي. بلا فوضى فوق الطاولة.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-center">علاش غادي يعجبك؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl border border-[#e6eaef] bg-white p-4 shadow-sm">
                <b.icon className="h-5 w-5 text-[#0891b2] mb-2" />
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
                <a.icon className="h-6 w-6 text-[#0891b2] mx-auto mb-2" />
                <p className="font-bold text-sm">{a.title}</p>
                <p className="text-xs text-[#5b6578] mt-1 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-center">كيفاش كيتستعمل؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-[#e6eaef] bg-white">
              <Image
                src={inUseSrc}
                alt="طفلة كترسم على الحامل المدمج لطقم الرسم الأزرق"
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-[#e6eaef] bg-white">
              <Image
                src={closeSrc}
                alt="تفاصيل حامل الرسم والكلابات السوداء وأقلام التلوين"
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
          <ol className="space-y-3">
            {[
              { n: "1", t: "افتح الحقيبة", d: "حطها فوق الطاولة وافتح الثلاث طيات. الحامل كيبان فالوسط." },
              { n: "2", t: "ثبت الورقة", d: "أوقف الحامل الأبيض وشد الورقة بالكلابات السوداء." },
              { n: "3", t: "اختار الأداة", d: "ماركر، قلم تلوين، لون شمع، أو ألوان مائية مع الفرشاة." },
              { n: "4", t: "طوي وكلشي يرجع", d: "كل أداة فتجويفها. طوي الحقيبة من المقبض — بلا فوضى." },
            ].map((s) => (
              <li key={s.n} className="flex gap-3 rounded-2xl border border-[#e6eaef] bg-white p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0891b2] text-white font-black">
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

        <section className="space-y-3">
          <h2 className="text-xl font-black text-center">شنو كاين بالضبط؟</h2>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-[#e6eaef] bg-white">
            <Image
              src={featuresSrc}
              alt="طقم الرسم مفتوح من فوق: ماركر، أقلام، ألوان شمع ومائية"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[
              "حقيبة بلاستيك زرقاء قابلة للطي",
              "حامل أبيض ينفتح مع كلابين",
              "ماركر وأقلام تلوين فصفوف",
              "ألوان شمع وباستيل مرتبين بالألوان",
              "علبة ألوان مائية وفرشاة",
              "ممحاة ومبراة فتجويف خاص",
            ].map((line) => (
              <li key={line} className="flex items-center gap-2 rounded-xl bg-white border border-[#e6eaef] px-3 py-2.5">
                <Check className="h-4 w-4 text-[#0891b2] shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-center">فغرفة الأطفال… بلا فوضى</h2>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-[#e6eaef] bg-white">
            <Image
              src={kidsRoomSrc}
              alt="طقم الرسم في غرفة أطفال مع حامل مفتوح"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          <p className="text-sm text-[#5b6578] text-center leading-relaxed">
            كتحط الحقيبة فوق المكتب، كيرسم، وطاوي. الغرفة كتبقى منظمة.
          </p>
        </section>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-relaxed space-y-2">
          <p className="font-bold text-emerald-800">🚚 التوصيل لباب دارك</p>
          <p className="text-[#3d4554]">مجاني لجميع مدن المغرب. 24–48 ساعة للمدن الكبرى.</p>
          <p className="font-bold text-emerald-800 pt-1">💵 خلّص عند الاستلام</p>
          <p className="text-[#3d4554]">ما كخلص والو دابا. كتخلص كاش ملي توصلك الطلبية.</p>
        </div>

        <div ref={formSentinel}>
          <section className="rounded-3xl border border-cyan-200/70 bg-white p-5 sm:p-7 text-center space-y-4 shadow-sm mb-4">
            <h2 className="text-xl sm:text-2xl font-black">جاهز تفرح طفلك؟ 🎨</h2>
            <p className="text-sm sm:text-base text-[#5b6578] leading-relaxed">
              بـ{priceLabel} فقط، غادي تحصل على مجموعة الرسم والتلوين + Arabic Magic Book هدية مجانية.
            </p>
            <CtaButton onClick={scrollToOrder}>{CTA_ORDER}</CtaButton>
          </section>
          <ProductOrderForm
            product={product}
            variant={variant}
            quantity={1}
            extendedAddress
            cityOptions={moroccanCities}
            fullNamePlaceholder="مثال: محمد أمين"
            formTitle="اطلب الآن — الدفع عند الاستلام"
            formSubtitle="عمّر الاسم، الهاتف، المدينة والعنوان. ما كخلص والو حتى توصلك الطلبية."
            submitLabel={CTA_ORDER}
            currencyLabel="DH"
            summaryRows={[
              { label: "مجموعة الرسم والتلوين", value: "208 قطعة" },
              { label: "Arabic Magic Book", value: "🎁 هدية مجانية" },
              { label: "السعر", value: priceLabel },
            ]}
            orderNote="مجموعة رسم 208 قطعة + Arabic Magic Book هدية | 299 DH"
          />
        </div>

        <section className="rounded-3xl border border-[#e6eaef] bg-white p-5 sm:p-7 space-y-3">
          <h2 className="text-xl font-black text-center">شنو قالو الناس اللي جربوه؟</h2>
          <p className="text-sm text-[#5b6578] text-center leading-relaxed">
            أول الزبناء غادي يشاركو تجربتهم هنا بعد الاستلام.
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
                    <Check className="h-4 w-4 text-[#0891b2]" /> {item.ar}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq">
            <AccordionTrigger>الأسئلة الشائعة</AccordionTrigger>
            <AccordionContent className="text-[#5b6578] text-sm space-y-4">
              {KIDS_ART_FAQS.map((faq) => (
                <div key={faq.q}>
                  <p className="font-bold text-[#1c2333]">{faq.q}</p>
                  <p className="mt-1">{faq.a}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <section className="rounded-3xl border border-[#0891b2]/20 bg-white overflow-hidden shadow-sm">
          <div className="relative aspect-square bg-[#eef6f8]">
            <Image
              src={heroSrc}
              alt="مجموعة الرسم والتلوين للأطفال مع Arabic Magic Book هدية مجانية"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="space-y-1">
              <p className="text-lg font-black">🎨 مجموعة الرسم والتلوين</p>
              <p className="text-xl font-black text-[#0891b2]">+</p>
              <p className="text-lg font-black">🎁 Arabic Magic Book مجاناً</p>
            </div>
            <p className="text-3xl sm:text-4xl font-black tabular-nums text-[#0891b2]">
              🔥 {priceLabel} فقط
            </p>
            <p className="text-base sm:text-lg font-bold text-[#1c2333]">
              خلي طفلك يكتشف عالم الإبداع ديالو 🎨
            </p>
            <CtaButton onClick={scrollToOrder}>{CTA_ORDER}</CtaButton>
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
                <p className="text-xs font-bold text-[#5b6578] truncate">🎨 + 🎁 Arabic Magic Book</p>
                <p className="text-sm font-black tabular-nums text-[#0891b2]">{priceLabel}</p>
              </div>
              <button
                type="button"
                onClick={scrollToOrder}
                className="flex-1 h-12 rounded-xl bg-[#0891b2] hover:bg-[#0e7490] text-white font-black text-sm"
              >
                {CTA_ORDER}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
