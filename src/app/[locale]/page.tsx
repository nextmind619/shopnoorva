import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { FlashSaleSection, ProductGridSection } from "@/components/home/product-sections";
import { CategoriesSection } from "@/components/home/categories-section";
import {
  ReviewsSection,
  VideoTestimonialsSection,
  BeforeAfterSection,
  BenefitsSection,
  HowItWorksSection,
  FAQSection,
  InstagramSection,
  NewsletterSection,
} from "@/components/home/content-sections";
import { getBestSellers, getTrending, getTikTokViral } from "@/data/products";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    fr: "NOORVA — Lumières Premium & Projecteurs | Maroc",
    en: "NOORVA — Premium Lights & Projectors | Morocco",
    ar: "NOORVA — إضاءة فاخرة وبروجيكتور | المغرب",
  };
  const descriptions: Record<string, string> = {
    fr: "NOORVA — projecteurs galaxie, lampes sunset, lumières RGB. Livraison rapide au Maroc, paiement à la livraison.",
    en: "NOORVA — galaxy projectors, sunset lamps, RGB lights. Fast delivery in Morocco, cash on delivery.",
    ar: "NOORVA — بروجيكتور مجرة، مصابيح sunset، إضاءة RGB. توصيل سريع في المغرب، دفع عند الاستلام.",
  };

  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      locale: locale === "ar" ? "ar_MA" : locale === "fr" ? "fr_MA" : "en_MA",
      type: "website",
      images: [{ url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80", width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: { ar: "/ar", fr: "/fr", en: "/en" },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("sections");
  const bestSellers = getBestSellers();
  const trending = getTrending();
  const tiktokViral = getTikTokViral();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/fr/products?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/logo.png`,
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+212-522-000-000",
            contactType: "customer service",
            areaServed: "MA",
            availableLanguage: ["Arabic", "French", "English"],
          },
        }}
      />
      <HeroSection />
      <FlashSaleSection />
      <CategoriesSection />
      <ProductGridSection title={t("bestSellers")} products={bestSellers} filter="bestseller" />
      <ProductGridSection title={t("trending")} products={trending} filter="trending" />
      <ProductGridSection title={t("tiktokViral")} products={tiktokViral} filter="viral" />
      <BeforeAfterSection />
      <BenefitsSection />
      <ReviewsSection />
      <VideoTestimonialsSection />
      <HowItWorksSection />
      <FAQSection />
      <InstagramSection />
      <NewsletterSection />
    </>
  );
}
