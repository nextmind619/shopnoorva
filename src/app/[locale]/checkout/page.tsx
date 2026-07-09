import { Suspense } from "react";
import { CheckoutPageClient } from "@/components/checkout/checkout-page-client";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container-luxury section-padding text-center">Loading...</div>}>
      <CheckoutPageClient />
    </Suspense>
  );
}
