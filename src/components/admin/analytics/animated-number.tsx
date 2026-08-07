"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";

interface AnimatedNumberProps {
  value: number;
  format?: (n: number) => string;
  className?: string;
}

export function AnimatedNumber({ value, format, className }: AnimatedNumberProps) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => (format ? format(v) : Math.round(v).toLocaleString()));
  const [text, setText] = useState("0");
  const prev = useRef(value);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    return display.on("change", (v) => setText(String(v)));
  }, [display]);

  useEffect(() => {
    prev.current = value;
  }, [value]);

  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.6, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {text}
    </motion.span>
  );
}
