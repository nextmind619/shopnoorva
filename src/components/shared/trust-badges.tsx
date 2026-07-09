"use client";

import { motion } from "motion/react";
import { Truck, Banknote, RotateCcw, Shield, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

const icons = { truck: Truck, cod: Banknote, returns: RotateCcw, warranty: Shield, delivery: Clock };

export function TrustBadges({ variant = "light" }: { variant?: "light" | "dark" }) {
  const t = useTranslations("trust");
  const items = [
    { key: "shipping", icon: "truck" as const },
    { key: "cod", icon: "cod" as const },
    { key: "returns", icon: "returns" as const },
    { key: "delivery", icon: "delivery" as const },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, i) => {
        const Icon = icons[item.icon];
        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`flex flex-col items-center text-center gap-3 p-5 rounded-2xl ${
              variant === "dark" ? "glass-dark text-cream" : "glass shadow-soft"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-sm font-medium">{t(`${item.key}.title`)}</p>
              <p className={`text-xs mt-1 ${variant === "dark" ? "text-cream/60" : "text-muted"}`}>
                {t(`${item.key}.desc`)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
