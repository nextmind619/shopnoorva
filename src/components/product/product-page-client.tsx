"use client";

import dynamic from "next/dynamic";
import type { Product, ProductCardSummary, ProductReview } from "@/types";
import type { GallerySlide } from "@/lib/product-gallery-slides";

const ProductPageAr = dynamic(
  () => import("@/components/product/product-page-ar").then((m) => m.ProductPageAr),
  { ssr: true, loading: () => <ProductPageShell /> },
);

const ProductPageVintageLantern = dynamic(
  () => import("@/components/product/product-page-vintage-lantern").then((m) => m.ProductPageVintageLantern),
  { ssr: true, loading: () => <ProductPageShell /> },
);
const ProductPageWarmLedDecorLamp = dynamic(
  () => import("@/components/product/product-page-warm-led-decor-lamp").then((m) => m.ProductPageWarmLedDecorLamp),
  { ssr: true, loading: () => <ProductPageShell /> },
);
const ProductPageSolarCalculator = dynamic(
  () => import("@/components/product/product-page-solar-calculator").then((m) => m.ProductPageSolarCalculator),
  { ssr: true, loading: () => <ProductPageShell /> },
);
const ProductPageMiniVacuum = dynamic(
  () => import("@/components/product/product-page-mini-vacuum").then((m) => m.ProductPageMiniVacuum),
  { ssr: true, loading: () => <ProductPageShell /> },
);
const ProductPageCurvesGlow = dynamic(
  () => import("@/components/product/product-page-curves-glow").then((m) => m.ProductPageCurvesGlow),
  { ssr: true, loading: () => <ProductPageShell /> },
);
const ProductPageRoosterAnalogTableClock = dynamic(
  () =>
    import("@/components/product/product-page-rooster-analog-table-clock").then(
      (m) => m.ProductPageRoosterAnalogTableClock,
    ),
  { ssr: true, loading: () => <ProductPageShell className="bg-[#f7f3ed]" /> },
);

const FacebookProductTracker = dynamic(
  () => import("@/components/facebook/facebook-trackers").then((m) => m.FacebookProductTracker),
  { ssr: false },
);

function ProductPageShell({ className }: { className?: string }) {
  return <div className={className ?? "min-h-[70vh] bg-[#0a0a0f]"} aria-hidden />;
}

interface ProductPageClientProps {
  product: Product;
  relatedCards: ProductCardSummary[];
  reviews?: ProductReview[];
  gallerySlides?: GallerySlide[];
  benefitHeadline?: { title: string; subtitle: string };
  heroImage?: string;
}

export function ProductPageClient({
  product,
  relatedCards,
  reviews,
  gallerySlides,
  benefitHeadline,
  heroImage,
}: ProductPageClientProps) {
  const defaultVariant = product.variants[0];

  return (
    <>
      <FacebookProductTracker
        productId={product.id}
        contentName={product.name.ar}
        value={defaultVariant?.price ?? product.price}
        currency="MAD"
        quantity={1}
      />
      {product.slug === "vintage-led-lantern" ? (
        <ProductPageVintageLantern product={product} related={relatedCards} />
      ) : product.slug === "warm-led-decor-lamp" ? (
        <ProductPageWarmLedDecorLamp product={product} related={relatedCards} />
      ) : product.slug === "solar-calculator-lcd-notepad" ? (
        <ProductPageSolarCalculator product={product} />
      ) : product.slug === "cordless-mini-vacuum-keyboard" ? (
        <ProductPageMiniVacuum product={product} />
      ) : product.slug === "proteine-curve-collagen-glow" ? (
        <ProductPageCurvesGlow product={product} />
      ) : product.slug === "rooster-analog-table-clock" ? (
        <ProductPageRoosterAnalogTableClock product={product} />
      ) : (
        <ProductPageAr
          product={product}
          related={relatedCards}
          reviews={reviews}
          gallerySlides={gallerySlides}
          benefitHeadline={benefitHeadline}
          heroImage={heroImage}
        />
      )}
    </>
  );
}
