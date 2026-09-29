import Link from "next/link";
import type { Metadata } from "next";
import { AccessDeniedRecovery } from "@/components/security/access-denied-recovery";

export const metadata: Metadata = {
  title: "Access Denied | NOORVA",
  robots: { index: false, follow: false },
  verification: {
    other: {
      "facebook-domain-verification": "gsg759rql91jkxu1wywq1fibppl2tl",
    },
  },
};

export default function AccessDeniedPage() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "linear-gradient(160deg, #0f0f12 0%, #1a1a22 50%, #121218 100%)",
          color: "#f5f5f5",
          padding: 24,
        }}
      >
        <main style={{ maxWidth: 480, textAlign: "center" }}>
          <p style={{ letterSpacing: "0.3em", fontSize: 12, opacity: 0.6, marginBottom: 16 }}>NOORVA</p>
          <h1 style={{ fontSize: 32, margin: "0 0 12px", fontWeight: 700 }}>Access Denied</h1>
          <p style={{ opacity: 0.75, lineHeight: 1.6, marginBottom: 28 }}>
            This request was blocked by our store protection system. If you are a real customer,
            turn off any VPN and open the site again in your normal browser — desktop or mobile.
            You do not need to arrive from an ad.
          </p>
          <p style={{ opacity: 0.75, lineHeight: 1.6, marginBottom: 28, direction: "rtl" }}>
            تم حظر هذا الطلب بواسطة نظام حماية المتجر. إذا كنت زبوناً حقيقياً، عطّل VPN وافتح الموقع
            مجدداً من متصفحك العادي على الحاسوب أو الهاتف. لا تحتاج إلى الدخول من إعلان.
          </p>
          <Link
            href="/ar"
            style={{
              display: "inline-block",
              padding: "12px 22px",
              background: "#c9a227",
              color: "#111",
              textDecoration: "none",
              fontWeight: 700,
              borderRadius: 8,
            }}
          >
            Try storefront
          </Link>
          <AccessDeniedRecovery />
        </main>
      </body>
    </html>
  );
}
