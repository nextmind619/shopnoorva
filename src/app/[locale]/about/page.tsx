import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | LUXMAR",
  description: "Discover the story behind LUXMAR — authentic Moroccan luxury skincare",
};

const content: Record<string, { title: string; paragraphs: string[] }> = {
  fr: {
    title: "Notre Histoire",
    paragraphs: [
      "LUXMAR est née au cœur du Souss marocain, berceau de l'huile d'argan. Notre mission : partager l'essence de la beauté marocaine authentique avec le monde entier.",
      "Chaque produit est soigneusement sélectionné, certifié BIO et conditionné dans nos installations à Casablanca. Nous travaillons directement avec les coopératives féminines des régions d'Agadir et d'Essaouira.",
      "Notre engagement : qualité premium, prix accessibles, livraison rapide et paiement à la livraison partout au Maroc.",
    ],
  },
  en: {
    title: "Our Story",
    paragraphs: [
      "LUXMAR was born in the heart of Morocco's Souss region, the birthplace of argan oil. Our mission: to share the essence of authentic Moroccan beauty with the world.",
      "Every product is carefully selected, BIO certified and packaged in our Casablanca facilities. We work directly with women's cooperatives in the Agadir and Essaouira regions.",
      "Our commitment: premium quality, accessible prices, fast delivery and cash on delivery across Morocco.",
    ],
  },
  ar: {
    title: "قصتنا",
    paragraphs: [
      "ولدت LUXMAR في قلب منطقة سوس المغربية، مهد زيت الأرgan. مهمتنا: مشاركة جوهر الجمال المغربي الأصيل مع العالم.",
      "كل منتج يُختار بعناية، معتمد BIO ويُعبأ في مرافقنا بالدار البيضاء. نعمل مباشرة مع تعاونيات النساء في أگadir والصويرة.",
      "التزامنا: جودة فاخرة، أسعار معقولة، توصيل سريع والدفع عند الاستلام في جميع أنحاء المغرب.",
    ],
  },
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = content[locale] || content.fr;

  return (
    <div className="container-luxury section-padding max-w-3xl">
      <h1 className="font-display text-4xl md:text-5xl font-light mb-8">{page.title}</h1>
      <div className="space-y-6 text-neutral-600 leading-relaxed">
        {page.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
