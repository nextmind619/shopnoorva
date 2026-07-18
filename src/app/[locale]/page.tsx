import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import {
  TrustGridSection,
  ProblemSection,
  ProductDeepDiveSection,
  ComparisonSection,
  PillarsSection,
  ReviewsCarouselSection,
  TikTokReviewsSection,
  HowItWorksSection,
  GuaranteeSection,
  FAQSection,
  FinalCTASection,
} from "@/components/home/jadeel-sections";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    ar: "NOORVA — إضاءة فاخرة وبروجيكتور مجرة | المغرب",
    fr: "NOORVA — Projecteurs Galaxy Premium | Maroc",
    en: "NOORVA — Premium Galaxy Projectors | Morocco",
  };
  const descriptions: Record<string, string> = {
    ar: "٤ بروجيكتورات فاخرة لتحويل غرفتك: رائد فضاء بلوتوث، مجرة ونجوم ملونة، الأورورا الشمالية، كاروسيل الأرانب. توصيل 24-48 ساعة · دفع عند الاستلام في المغرب.",
    fr: "4 projecteurs premium : astronaute Bluetooth, galaxie multicolore, aurores boréales, carrousel lapin. Livraison 24-48h, paiement à la livraison au Maroc.",
    en: "4 premium projectors: astronaut Bluetooth, multi-color galaxy stars, northern lights aurora, rabbit carousel. 24-48h delivery, cash on delivery in Morocco.",
  };
  return {
    title: titles[locale] || titles.ar,
    description: descriptions[locale] || descriptions.ar,
    openGraph: { title: titles[locale], description: descriptions[locale], url: `${SITE_URL}/${locale}`, siteName: SITE_NAME, type: "website" },
    alternates: { canonical: `${SITE_URL}/${locale}`, languages: { ar: "/ar", fr: "/fr", en: "/en" } },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Store", name: SITE_NAME, url: SITE_URL, paymentAccepted: "Cash", currenciesAccepted: "MAD", areaServed: "MA" }} />
      <HeroSection />
      <TrustGridSection />
      <ProblemSection />
      <ProductDeepDiveSection />
      <ComparisonSection />
      <PillarsSection />
      <ReviewsCarouselSection />
      <TikTokReviewsSection />
      <HowItWorksSection />
      <GuaranteeSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
