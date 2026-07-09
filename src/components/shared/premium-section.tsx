"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface PremiumSectionProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function PremiumSection({ eyebrow, title, subtitle, children, className, dark }: PremiumSectionProps) {
  return (
    <section className={cn("section-padding", dark ? "bg-noir text-cream" : "bg-cream", className)}>
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-14 md:mb-20"
        >
          {eyebrow && (
            <span className="inline-flex items-center gap-3 text-gold text-xs tracking-[0.35em] uppercase mb-5">
              <span className="w-10 h-px bg-gold" />
              {eyebrow}
              <span className="w-10 h-px bg-gold" />
            </span>
          )}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">{title}</h2>
          {subtitle && (
            <p className={cn("mt-5 text-base md:text-lg leading-relaxed", dark ? "text-cream/70" : "text-muted")}>
              {subtitle}
            </p>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
