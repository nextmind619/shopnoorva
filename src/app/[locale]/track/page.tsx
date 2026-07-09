import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { TrackOrderClient } from "@/components/checkout/track-order-client";

export default async function TrackPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <TrackOrderClient />
    </Suspense>
  );
}
