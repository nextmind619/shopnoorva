import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/hero-section";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL, SITE_NAME } from "@/lib/site";

/** Below-fold sections: separate chunk — not in First Load JS */
const HomeBelowFold = dynamic(
  () => import("@/components/home/home-below-fold").then((m) => m.HomeBelowFold),
  {
    loading: () => <div className="min-h-[60vh]" aria-hidden />,
    ssr: true,
  }
);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    ar: "NOORVA — إضاءة فاخرة وجهاز تدليك شياتسو | المغرب",
    fr: "NOORVA — Projecteurs Galaxy & Masseur Shiatsu | Maroc",
    en: "NOORVA — Premium Galaxy Projectors & Shiatsu Massager | Morocco",
  };
  const descriptions: Record<string, string> = {
    ar: "منتجات فاخرة للمغرب: جهاز تدليك الرقبة شياتسو مع تدفئة، بروجيكتور رائد الفضاء بلوتوث، مجرة ونجوم، الأورورا، وكاروسيل الأرانب. توصيل 24-48 ساعة · دفع عند الاستلام.",
    fr: "Produits premium au Maroc : masseur Shiatsu cou & épaules avec chauffage, projecteur astronaute Bluetooth, galaxie, aurores, carrousel lapin. Livraison 24-48h, paiement à la livraison.",
    en: "Premium products for Morocco: Shiatsu neck massager with heat, astronaut Bluetooth projector, galaxy stars, aurora, rabbit carousel. 24-48h delivery, cash on delivery.",
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
      <HomeBelowFold />
    </>
  );
}
