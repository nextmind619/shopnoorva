"use client";

import {
  Package,
  Truck,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  MapPin,
  Headphones,
} from "lucide-react";
import type { Product } from "@/types";
import { motion } from "motion/react";

interface ProductTrustBlocksProps {
  product: Product;
  /** When true, skip guarantee block (rendered separately on the page). */
  hideGuarantee?: boolean;
}

function getStory(slug: string) {
  if (slug === "rabbit-carousel-night-light") {
    return {
      eyebrow: "قبل النوم",
      title: "ليلة هادئة… بلا خوف من الظلام",
      paragraphs: [
        "كاروسيل الأرانب الوردي كيحول غرفة طفلك لعالم سحري: أرانب دوّارة 360°، إضاءة LED بـ 5 ألوان، و6 أفلام إسقاط قابلة للتبديل — باش ينعس بهدوء وأنتِ مرتاحة البال.",
        "التصميم الوردي الأنيق كيبان هدية فاخرة فوق الكومودينو. شغّليه عبر USB، اختاري اللون والسطوع، وبدّلي ثيم الإسقاط في ثواني — من سماء النجوم حتى عالم المحيط والديناصورات.",
      ],
    };
  }
  if (slug === "northern-lights-galaxy-projector") {
    return {
      eyebrow: "التجربة",
      title: "سقف غرفتك… يتحوّل لمجرة هادئة",
      paragraphs: [
        "بدل إضاءة عادية تضيّع الأجواء، هاد البروجيكتور كيملأ السقف والجدران بأورورا متحركة، نجوم دقيقة، وقمر هلالي واضح — مثالي قبل النوم، للديكور، أو لسهرة هادئة مع موسيقى من هاتفك.",
        "التصميم الأبيض الهندسي كيبان أنيق فوق الطاولة أو الكومودينو، والريموت كيعطيك التحكم من السرير: الألوان، السطوع، السرعة، ومؤقت الإيقاف التلقائي.",
      ],
    };
  }
  if (slug === "bluetooth-star-projector") {
    return {
      eyebrow: "التجربة",
      title: "من إضاءة عادية… إلى مجرة بـ21 وضع",
      paragraphs: [
        "بروجيكتور المجرة بقبة كريستال كيعرض نجوم وموجات ملونة حتى 21 وضعاً، مع سبيكر بلوتوث باش تشغّل موسيقاك وأنت مسترخٍ. الريموت فيه مؤقت 1س/2س — مثالي قبل النوم أو لسهرة في الدار.",
        "جسم أسود أنيق، تشغيل USB، والدفع عند الاستلام في جميع مدن المغرب.",
      ],
    };
  }
  if (slug.includes("magnetic-car-phone-mount")) {
    return {
      eyebrow: "القيادة الآمنة",
      title: "الهاتف ثابت… والملاحة واضحة بلا ما تمسّو",
      paragraphs: [
        "الحامل المغناطيسي كيشد الهاتف بقوة على الرأس MagSafe، والذراع متعدد المفاصل كيخلّيك تضبط الزاوية والارتفاع باش GPS يبقى واضح بلا ما يحجب الرؤية. قاعدة الشفط مع قفل TIGHT/OPEN كتعطي ثبات حتى فالمطبات.",
        "تركيب في ثوانٍ على لوحة القيادة أو الزجاج، تصميم أسود قابل للطي، ودفع عند الاستلام في جميع مدن المغرب.",
      ],
    };
  }
  if (slug.includes("astronaut")) {
    return {
      eyebrow: "التجربة",
      title: "من غرفة عادية… إلى سقف مليان نجوم",
      paragraphs: [
        "بروجيكتور رائد الفضاء MX003 كيجمع بين إسقاط مجرة HD وسبيكر بلوتوث في جهاز واحد أنيق. شغّلو في غرفة مظلمة، وجّه الخوذة للسقف، ووصّل هاتفك — والنتيجة أجواء سينمائية بلا تجهيز معقّد.",
        "مثالي للنوم، غرفة الأطفال، أو هدية تُفتح وتُحكى. الريموت، كابل Type-C، والدفع عند الاستلام في جميع مدن المغرب.",
      ],
    };
  }
  return {
    eyebrow: "التجربة",
    title: "أجواء فاخرة من أول تشغيل",
    paragraphs: [
      productDeepFallback(productNameHint(slug)),
      "الريموت والتحكم السهل كيعطيك تجربة مريحة كل مساء — مع توصيل سريع والدفع عند الاستلام في المغرب.",
    ],
  };
}

function productNameHint(slug: string) {
  if (slug.includes("astronaut")) return "بروجيكتور رائد الفضاء";
  if (slug.includes("star")) return "بروجيكتور النجوم";
  if (slug.includes("magnetic-car-phone-mount")) return "الحامل المغناطيسي للسيارة";
  return "هاد المنتج";
}

function productDeepFallback(name: string) {
  return `${name} من NOORVA مصمّم باش يحوّل غرفتك لأجواء هادئة وفاخرة — مثالي للنوم، الديكور، والهدايا.`;
}

export function ProductTrustBlocks({ product, hideGuarantee = false }: ProductTrustBlocksProps) {
  const boxItems = product.packageIncludes?.length
    ? product.packageIncludes
    : [];
  const story = getStory(product.slug);

  return (
    <div className="space-y-8 mt-12">
      {/* قصة المنتج — سرد تحريري أصلي */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.5 }}
        className="bg-[#1a1a24] rounded-[2rem] border border-white/10 p-8 sm:p-10"
      >
        <p className="text-[10px] font-bold tracking-[0.25em] text-[#6366f1] uppercase mb-3">
          {story.eyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">
          {story.title}
        </h2>
        <div className="space-y-4 text-white/70 leading-relaxed text-base max-w-3xl">
          {story.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </motion.section>

      {/* محتوى العلبة */}
      {boxItems.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-48px" }}
          transition={{ duration: 0.5 }}
          className="bg-[#1a1a24] rounded-[2rem] border border-white/10 p-8 sm:p-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/5 p-3 rounded-xl">
              <Package className="h-6 w-6 text-[#6366f1]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">شنو كاين فالعلبة؟</h2>
              <p className="text-sm text-white/55 mt-1">كلشي جاهز من أول تشغيل — بلا مشتريات إضافية</p>
            </div>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {boxItems.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 bg-[#12121a] rounded-2xl border border-white/10 px-4 py-3.5"
              >
                <BadgeCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium text-white">{item.ar}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      {/* التوصيل */}
      <motion.section
        id="delivery"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.5 }}
        className="bg-[#1a1a24] rounded-[2rem] border border-white/10 p-8 sm:p-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/5 p-3 rounded-xl">
            <Truck className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">التوصيل فجميع مدن المغرب</h2>
            <p className="text-sm text-white/55 mt-1">تتبّع طلبك بسهولة — والدفع غير ملي يوصلك</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: MapPin, title: "المدن الكبرى", desc: "24–48 ساعة (الدار البيضاء، الرباط، مراكش، فاس، طنجة…)" },
            { icon: Truck, title: "باقي المدن", desc: "2–4 أيام عمل حسب المنطقة" },
            { icon: Headphones, title: "تتبع ودعم", desc: "إشعار بالواتساب + صفحة تتبع الطلب" },
          ].map((item) => (
            <div key={item.title} className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
              <item.icon className="h-5 w-5 text-[#6366f1] mb-3" />
              <p className="text-sm font-bold text-white">{item.title}</p>
              <p className="text-xs text-white/55 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* الضمان */}
      {!hideGuarantee && (
        <motion.section
          id="guarantee"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-48px" }}
          transition={{ duration: 0.5 }}
          className="bg-[#1a1a24] rounded-[2rem] border border-white/10 p-8 sm:p-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/5 p-3 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">ضمان راحتك</h2>
              <p className="text-sm text-white/55 mt-1">طلب آمن — بلا مخاطرة</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: RotateCcw,
                title: "استبدال خلال 7 أيام",
                desc: "إلا كان عيب مصنعي، كنبدّلوه بسرعة عبر واتساب.",
              },
              {
                icon: ShieldCheck,
                title: `ضمان ${product.warrantyMonths || 12} شهر`,
                desc: "تغطية على عيوب التصنيع طيلة مدة الضمان.",
              },
              {
                icon: BadgeCheck,
                title: "الدفع عند الاستلام",
                desc: "ما كتدفع والو دابا. خلّص كاش ملي تشوف الطلب قدامك.",
              },
              {
                icon: Package,
                title: "تغليف محمي",
                desc: "شحنة مؤمّنة باش يوصلك المنتج سليم 100%.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 bg-[#12121a] rounded-2xl border border-white/10 p-5"
              >
                <div className="shrink-0 bg-emerald-500/10 p-2.5 rounded-xl">
                  <item.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="text-xs text-white/55 mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
