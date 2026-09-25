"use client";

import dynamic from "next/dynamic";
import type { Product, ProductCardSummary, ProductReview } from "@/types";
import { ProductPageAr } from "@/components/product/product-page-ar";

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

const FacebookProductTracker = dynamic(
  () => import("@/components/facebook/facebook-trackers").then((m) => m.FacebookProductTracker),
  { ssr: false },
);

function ProductPageShell() {
  return <div className="min-h-[70vh] bg-[#0a0a0f]" aria-hidden />;
}

interface ProductPageClientProps {
  product: Product;
  relatedCards: ProductCardSummary[];
  reviews?: ProductReview[];
}

export function ProductPageClient({ product, relatedCards, reviews }: ProductPageClientProps) {
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
      ) : (
        <ProductPageAr product={product} related={relatedCards} reviews={reviews} />
      )}
    </>
  );
}
