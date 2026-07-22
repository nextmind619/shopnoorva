"use client";

import dynamic from "next/dynamic";

/** Client-only chrome that must not block SSR / First Load of the layout */
const StoreSecurity = dynamic(
  () => import("@/components/security/store-security").then((m) => m.StoreSecurity),
  { ssr: false }
);

const WhatsAppFloat = dynamic(
  () => import("@/components/layout/whatsapp-float").then((m) => m.WhatsAppFloat),
  { ssr: false }
);

export function DeferredClientChrome() {
  return (
    <>
      <StoreSecurity />
      <WhatsAppFloat />
    </>
  );
}
