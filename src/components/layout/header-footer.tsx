"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import { Star, ShoppingBag, Heart, Search, Menu, X, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { locales, localeNames } from "@/i18n/config";

export function AnnouncementBar() {
  const t = useTranslations("announcement");
  const locale = useLocale();

  return (
    <div className="bg-black text-white text-center py-2.5 px-4 text-xs sm:text-sm tracking-wide">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2 flex-wrap"
      >
        <span className="text-gold">✦</span>
        {t("text")}
        <Link href={`/${locale}/products`} className="underline underline-offset-4 hover:text-gold transition-colors ml-1">
          {t("cta")}
        </Link>
      </motion.p>
    </div>
  );
}

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/products`, label: t("shop") },
    { href: `/${locale}/categories`, label: t("categories") },
    { href: `/${locale}/about`, label: t("about") },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
      )}
    >
      <div className="container-luxury flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="font-display text-2xl md:text-3xl font-semibold tracking-[0.2em]">
          NOOR<span className="text-gold">VA</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide uppercase hover:text-gold transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <Link href={`/${locale}/products`} className="hidden sm:block p-2 hover:text-gold transition-colors">
            <Search className="h-5 w-5" />
          </Link>

          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="p-2 hover:text-gold transition-colors flex items-center gap-1"
              aria-label="Language"
            >
              <Globe className="h-5 w-5" />
              <span className="text-xs uppercase hidden sm:inline">{locale}</span>
            </button>
            {langOpen && (
              <div className="absolute top-full end-0 mt-2 bg-white border shadow-lg py-2 min-w-[120px] z-50">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={`/${l}`}
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-neutral-50 transition-colors",
                      l === locale && "text-gold font-medium"
                    )}
                    onClick={() => setLangOpen(false)}
                  >
                    {localeNames[l]}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href={`/${locale}/cart`} className="relative p-2 hover:text-gold transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 bg-gold text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t bg-white"
        >
          <div className="container-luxury py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide uppercase py-2 hover:text-gold transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.nav>
      )}
    </header>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const shopLinks = [
    { href: `/${locale}/products`, label: t("shop") },
    { href: `/${locale}/categories`, label: tNav("categories") },
    { href: `/${locale}/products?filter=bestseller`, label: locale === "ar" ? "الأكثر مبيعًا" : "Best-Sellers" },
  ];

  const supportLinks = [
    { href: `/${locale}/shipping`, label: t("shipping") },
    { href: `/${locale}/returns`, label: t("returns") },
    { href: `/${locale}/faq`, label: t("faq") },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="container-luxury section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href={`/${locale}`} className="font-display text-2xl tracking-[0.2em]">
              NOOR<span className="text-gold">VA</span>
            </Link>
            <p className="mt-4 text-neutral-400 text-sm leading-relaxed">{t("tagline")}</p>
            <div className="mt-6 flex gap-4">
              <a href="https://instagram.com/shopnoorva" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-gold transition-colors text-sm">Instagram</a>
              <a href="https://tiktok.com/@shopnoorva" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-gold transition-colors text-sm">TikTok</a>
              <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-gold transition-colors text-sm">{t("whatsapp")}</a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium tracking-widest uppercase mb-4">{t("shop")}</h4>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-neutral-400 text-sm hover:text-gold transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium tracking-widest uppercase mb-4">{t("support")}</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-neutral-400 text-sm hover:text-gold transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium tracking-widest uppercase mb-4">{t("company")}</h4>
            <ul className="space-y-3">
              <li><Link href={`/${locale}/about`} className="text-neutral-400 text-sm hover:text-gold transition-colors">{t("about")}</Link></li>
              <li><Link href={`/${locale}/privacy`} className="text-neutral-400 text-sm hover:text-gold transition-colors">{t("privacy")}</Link></li>
              <li><Link href={`/${locale}/terms`} className="text-neutral-400 text-sm hover:text-gold transition-colors">{t("terms")}</Link></li>
            </ul>
            <p className="mt-6 text-neutral-400 text-sm">{t("phone")}</p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-xs">{t("copyright")}</p>
          <div className="flex items-center gap-4 text-neutral-500 text-xs">
            <span>MAD</span>
            <span>•</span>
            <span>🇲🇦 Morocco</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
