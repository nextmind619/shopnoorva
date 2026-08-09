import { Cairo, Tajawal } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { AnnouncementBar, Header, Footer } from "@/components/layout/header-footer";
import { DeferredClientChrome } from "@/components/layout/deferred-client-chrome";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import "../globals.css";

/** Lean font set — fewer Arabic WOFF2 files on the critical path */
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["400", "700"],
  preload: true,
  adjustFontFallback: true,
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  variable: "--font-tajawal",
  display: "swap",
  weight: ["400", "700"],
  preload: false,
  adjustFontFallback: true,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as typeof locales[number])) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable} h-full`}>
      <head>
        <meta name="facebook-domain-verification" content="gsg759rql91jkxu1wywq1fibppl2tl" />
        {/* Hero uses next/image priority — avoid double-fetching the raw WebP */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <AnalyticsScripts />
          <AnnouncementBar />
          <Header />
          <main className="flex-1 min-w-0 w-full overflow-x-clip">{children}</main>
          <Footer />
          <DeferredClientChrome />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
