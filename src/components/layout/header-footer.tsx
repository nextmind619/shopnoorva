"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Menu, X, ShoppingBag, Globe } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { cn } from "@/lib/utils";
import { locales, localeNames } from "@/i18n/config";

const TRUST_TICKER = [
  { key: "cod", icon: "💵" },
  { key: "shipping", icon: "🚚" },
  { key: "warranty", icon: "🛡️" },
  { key: "morocco", icon: "🇲🇦" },
  { key: "secure", icon: "🔒" },
];

export function AnnouncementBar() {
  const t = useTranslations("announcement");
  return (
    <div className="bg-navy text-cream text-center py-2 px-4 text-xs sm:text-sm overflow-hidden relative z-[60]">
      <div className="flex animate-marquee whitespace-nowrap gap-12">
        {[...TRUST_TICKER, ...TRUST_TICKER].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <span>{item.icon}</span>
            {t(`ticker.${item.key}`)}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const setCartOpen = useCartStore((s) => s.setOpen);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/products`, label: t("collection") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/track`, label: t("track") },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-black/5">
        <div className="container-luxury px-4 h-[72px] flex items-center justify-between">
          <button className="p-2 lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.slice(0, 2).map((link) => (
              <Link key={link.href} href={link.href} className="text-xs tracking-[0.15em] uppercase hover:text-gold transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href={`/${locale}`} className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center">
            <span className="font-display text-2xl md:text-3xl font-semibold tracking-[0.15em]">
              NOOR<span className="text-gold">VA</span>
            </span>
            <span className="text-[10px] text-muted tracking-widest hidden sm:block">{t("tagline")}</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <button onClick={() => setLangOpen(!langOpen)} className="p-2 hover:text-gold flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span className="text-xs uppercase">{locale}</span>
              </button>
              {langOpen && (
                <div className="absolute top-full end-0 mt-1 bg-white border shadow-lg py-2 min-w-[120px] rounded-xl z-50">
                  {locales.map((l) => (
                    <Link key={l} href={`/${l}`} className={cn("block px-4 py-2 text-sm hover:text-gold", l === locale && "text-gold font-medium")} onClick={() => setLangOpen(false)}>
                      {localeNames[l]}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setCartOpen(true)} className="relative w-11 h-11 rounded-full border border-black/10 flex items-center justify-center hover:border-gold hover:text-gold transition-colors" aria-label={t("cart")}>
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -end-1 bg-gold text-noir text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{itemCount}</span>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="lg:hidden border-t bg-cream px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm py-2 hover:text-gold" onClick={() => setMenuOpen(false)}>{link.label}</Link>
            ))}
          </nav>
        )}
      </header>
      <CartDrawer />
    </>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  return (
    <footer className="bg-navy text-cream">
      <div className="container-luxury section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <p className="font-display text-2xl tracking-[0.15em]">NOOR<span className="text-gold">VA</span></p>
            <p className="text-cream/60 text-sm mt-2">{tNav("tagline")}</p>
            <p className="text-cream/50 text-sm mt-4 leading-relaxed">{t("tagline")}</p>
            <div className="mt-5 flex gap-4">
              <a href="https://instagram.com/shopnoorva" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-gold text-sm">Instagram</a>
              <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-gold text-sm">{t("whatsapp")}</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4 text-gold">{t("shop")}</h4>
            <ul className="space-y-2 text-sm text-cream/60">
              <li><Link href={`/${locale}`} className="hover:text-gold">{tNav("home")}</Link></li>
              <li><Link href={`/${locale}/products`} className="hover:text-gold">{tNav("collection")}</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-gold">{t("about")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4 text-gold">{t("support")}</h4>
            <ul className="space-y-2 text-sm text-cream/60">
              <li><Link href={`/${locale}/track`} className="hover:text-gold">{tNav("track")}</Link></li>
              <li><a href="https://wa.me/212600000000" className="hover:text-gold">{t("contact")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4 text-gold">{t("legal")}</h4>
            <ul className="space-y-2 text-sm text-cream/60">
              <li><Link href={`/${locale}/about`} className="hover:text-gold">{t("privacy")}</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-gold">{t("terms")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-cream/10 text-center">
          <p className="text-xs text-cream/40 mb-2">{t("trustLine")}</p>
          <p className="text-xs text-cream/30">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
