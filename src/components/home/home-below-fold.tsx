"use client";

/**
 * Below-fold homepage sections — loaded as a separate JS chunk after Hero.
 * Keeps initial First Load JS small without changing section UI.
 */
export {
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

export function HomeBelowFold() {
  return (
    <>
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
