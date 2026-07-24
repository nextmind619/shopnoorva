import { Cairo, Tajawal } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { AnnouncementBar, Header, Footer } from "@/components/layout/header-footer";
import { DeferredClientChrome } from "@/components/layout/deferred-client-chrome";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import "../globals.css";

/** Critical display + body fonts — Tajawal not preloaded so hero wins the network */
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
  adjustFontFallback: true,
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  variable: "--font-tajawal",
  display: "swap",
  weight: ["400", "500", "700", "800"],
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
        <link rel="preload" as="image" href="/hero/collection-banner.webp" type="image/webp" fetchPriority="high" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <AnalyticsScripts />
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <DeferredClientChrome />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
