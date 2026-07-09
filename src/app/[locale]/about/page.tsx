import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن | NOORVA",
  description: "NOORVA — إضاءة فاخرة وبروجيكتورات لتحويل غرفتك",
};

const content: Record<string, { title: string; paragraphs: string[] }> = {
  ar: {
    title: "قصتنا",
    paragraphs: [
      "NOORVA علامة مغربية لإضاءة الأجواء: بروجيكتور مجرة، رائد فضاء، كاروسيل ليلي وديكور الغرف.",
      "هدفنا نوصلّك منتجات تراند بجودة محترمة، تغليف أنيق، وتوصيل سريع مع الدفع عند الاستلام في جميع المدن.",
      "كنركّزو على تجربة الزبون: طلب ساهل، تأكيد سريع، وضمان 12 شهر على المنتجات.",
    ],
  },
  fr: {
    title: "Notre Histoire",
    paragraphs: [
      "NOORVA est une marque marocaine d'éclairage d'ambiance: projecteurs galaxie, astronaute, carrousel et déco.",
      "Nous livrons des produits tendance avec une qualité soignée et le paiement à la livraison.",
      "Notre priorité: commande simple, confirmation rapide et garantie 12 mois.",
    ],
  },
  en: {
    title: "Our Story",
    paragraphs: [
      "NOORVA is a Moroccan ambient lighting brand: galaxy projectors, astronaut lights, carousel night lights and room decor.",
      "We deliver trending products with solid quality and cash on delivery nationwide.",
      "Our focus: easy ordering, fast confirmation and 12-month warranty.",
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
  const page = content[locale] || content.ar;

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
