"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import { Star, CheckCircle } from "lucide-react";
import { reviews, testimonials, faqs, instagramPosts } from "@/data/products";
import type { Locale } from "@/types";
import { getLocalized } from "@/lib/utils";
import { SectionHeader } from "@/components/shared/product-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Shield, Truck, Banknote, RotateCcw } from "lucide-react";

export function ReviewsSection() {
  const t = useTranslations("sections");
  const locale = useLocale() as Locale;

  return (
    <section className="section-padding bg-cream">
      <div className="container-luxury">
        <SectionHeader title={t("reviews")} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="premium-card rounded-2xl p-6 shadow-soft"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-gold text-gold" />
                ))}
              </div>
              <h4 className="font-medium text-sm mb-2">{getLocalized(review.title, locale)}</h4>
              <p className="text-neutral-600 text-sm leading-relaxed mb-4">{getLocalized(review.content, locale)}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{review.author}</p>
                  <p className="text-xs text-neutral-400">{review.city}</p>
                </div>
                {review.verified && (
                  <span className="flex items-center gap-1 text-xs text-gold">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VideoTestimonialsSection() {
  const t = useTranslations("sections");
  const locale = useLocale() as Locale;

  return (
    <section className="section-padding">
      <div className="container-luxury">
        <SectionHeader title={t("videoTestimonials")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative aspect-[9/16] max-h-[480px] overflow-hidden cursor-pointer"
            >
              <Image src={item.videoThumbnail} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold/80 transition-colors">
                  <div className="w-0 h-0 border-t-8 border-b-8 border-s-transparent border-e-[14px] border-e-white ms-1" />
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-6">
                <p className="text-white text-sm font-medium italic">&ldquo;{getLocalized(item.quote, locale)}&rdquo;</p>
                <p className="text-neutral-300 text-xs mt-2">{item.name} · {item.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BeforeAfterSection() {
  const t = useTranslations("sections");

  return (
    <section className="section-padding bg-black text-white">
      <div className="container-luxury">
        <SectionHeader title={t("beforeAfter")} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-4">Before</p>
            <div className="relative aspect-square overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1596755389378-c31d2fd6c2d0?w=600&q=80" alt="Before" fill className="object-cover" sizes="50vw" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">After · 30 Days</p>
            <div className="relative aspect-square overflow-hidden ring-2 ring-gold">
              <Image src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80" alt="After" fill className="object-cover" sizes="50vw" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LifestyleSection() {
  const t = useTranslations("sections");
  const images = [
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d2fafa1?w=800&q=80",
    "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",
  ];

  return (
    <section className="section-padding bg-noir text-cream overflow-hidden">
      <div className="container-luxury">
        <SectionHeader title={t("lifestyle")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden group"
            >
              <Image src={src} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  const t = useTranslations("benefits");
  const tSection = useTranslations("sections");

  const benefits = [
    { icon: Shield, key: "authentic" as const },
    { icon: Truck, key: "delivery" as const },
    { icon: Banknote, key: "cod" as const },
    { icon: RotateCcw, key: "returns" as const },
  ];

  return (
    <section className="section-padding">
      <div className="container-luxury">
        <SectionHeader title={tSection("whyNoorva")} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="premium-card rounded-2xl p-6 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-gold/10">
                <Icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-sm font-medium mb-2">{t(`${key}.title`)}</h3>
              <p className="text-xs text-muted leading-relaxed">{t(`${key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const t = useTranslations("howItWorks");
  const tSection = useTranslations("sections");

  const steps = ["step1", "step2", "step3"] as const;

  return (
    <section className="section-padding bg-neutral-50">
      <div className="container-luxury">
        <SectionHeader title={tSection("howItWorks")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <span className="font-display text-5xl text-gold/30 font-light">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-lg font-medium mt-2 mb-2">{t(`${step}.title`)}</h3>
              <p className="text-sm text-neutral-500">{t(`${step}.desc`)}</p>
              {i < 2 && (
                <div className="hidden md:block absolute top-8 -end-4 w-8 h-px bg-gold" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const t = useTranslations("sections");
  const locale = useLocale() as Locale;

  return (
    <section className="section-padding">
      <div className="container-luxury max-w-3xl">
        <SectionHeader title={t("faq")} />
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{getLocalized(faq.question, locale)}</AccordionTrigger>
              <AccordionContent>{getLocalized(faq.answer, locale)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function InstagramSection() {
  const t = useTranslations("sections");

  return (
    <section className="section-padding bg-neutral-50">
      <div className="container-luxury">
        <SectionHeader title={t("instagram")} subtitle="@shopnoorva" />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <Image src={post.image} alt="منشور إنستغرام" fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="16vw" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">♥ {post.likes}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="section-padding bg-black text-white">
      <div className="container-luxury max-w-2xl text-center">
        <h2 className="font-display text-3xl md:text-4xl font-light mb-3">{t("title")}</h2>
        <p className="text-neutral-400 mb-8">{t("subtitle")}</p>
        {submitted ? (
          <p className="text-gold">{t("success")}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t("placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-neutral-700 text-white placeholder:text-neutral-500"
            />
            <Button variant="gold" type="submit">{t("cta")}</Button>
          </form>
        )}
      </div>
    </section>
  );
}
