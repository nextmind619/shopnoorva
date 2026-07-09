import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ThankYouClient } from "@/components/checkout/thank-you-client";

export default async function ThankYouPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <ThankYouClient />
    </Suspense>
  );
}
