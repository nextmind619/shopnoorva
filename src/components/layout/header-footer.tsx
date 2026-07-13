"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Menu, X, PackageSearch, Search, MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/site";

const LOCALE = "ar";

const TRUST_TICKER = [
  { key: "shipping", icon: "🚚" },
  { key: "cod", icon: "💰" },
  { key: "returns", icon: "🔄" },
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
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${LOCALE}/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { href: `/${LOCALE}`, label: t("home") },
    { href: `/${LOCALE}/products`, label: t("collection") },
    { href: `/${LOCALE}/about`, label: t("about") },
    { href: `/${LOCALE}/track`, label: t("track") },
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

          <Link href={`/${LOCALE}`} className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center">
            <span className="font-display text-2xl md:text-3xl font-semibold tracking-[0.15em]">
              NOOR<span className="text-gold">VA</span>
            </span>
            <span className="text-[10px] text-muted tracking-widest hidden sm:block">{t("tagline")}</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <button type="button" onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-gold hidden sm:flex" aria-label={t("search")}>
              <Search className="h-4 w-4" />
            </button>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="p-2 hover:text-gold" aria-label={t("whatsapp")}>
              <MessageCircle className="h-4 w-4" />
            </a>
            <Link href={`/${LOCALE}/track`} className="w-11 h-11 rounded-full border border-black/10 flex items-center justify-center hover:border-gold hover:text-gold transition-colors" aria-label={t("track")}>
              <PackageSearch className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={handleSearch} className="border-t bg-cream px-4 py-3">
            <div className="container-luxury flex gap-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tCommon("search")}
                className="flex-1 h-11 px-4 rounded-full border border-black/10 bg-white text-sm focus:outline-none focus:border-gold"
                autoFocus
              />
              <button type="submit" className="h-11 px-5 rounded-full bg-noir text-cream text-sm font-medium hover:bg-noir/90">
                {t("search")}
              </button>
            </div>
          </form>
        )}

        {menuOpen && (
          <nav className="lg:hidden border-t bg-cream px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm py-2 hover:text-gold" onClick={() => setMenuOpen(false)}>{link.label}</Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="bg-navy text-cream">
      <div className="container-luxury section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <p className="font-display text-2xl tracking-[0.15em]">NOOR<span className="text-gold">VA</span></p>
            <p className="text-cream/60 text-sm mt-2">{tNav("tagline")}</p>
            <p className="text-cream/50 text-sm mt-4 leading-relaxed">{t("tagline")}</p>
            <div className="mt-5 flex gap-4">
              <a href="https://instagram.com/shopnoorva" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-gold text-sm">إنستغرام</a>
              <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-gold text-sm">{t("whatsapp")}</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4 text-gold">{t("shop")}</h4>
            <ul className="space-y-2 text-sm text-cream/60">
              <li><Link href={`/${LOCALE}`} className="hover:text-gold">{tNav("home")}</Link></li>
              <li><Link href={`/${LOCALE}/products`} className="hover:text-gold">{tNav("collection")}</Link></li>
              <li><Link href={`/${LOCALE}/about`} className="hover:text-gold">{t("about")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4 text-gold">{t("support")}</h4>
            <ul className="space-y-2 text-sm text-cream/60">
              <li><Link href={`/${LOCALE}/track`} className="hover:text-gold">{tNav("track")}</Link></li>
              <li><a href="https://wa.me/212600000000" className="hover:text-gold">{t("contact")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4 text-gold">{t("legal")}</h4>
            <ul className="space-y-2 text-sm text-cream/60">
              <li><Link href={`/${LOCALE}/about`} className="hover:text-gold">{t("privacy")}</Link></li>
              <li><Link href={`/${LOCALE}/about`} className="hover:text-gold">{t("terms")}</Link></li>
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
