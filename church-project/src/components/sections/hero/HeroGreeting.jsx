"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import heroGreetings from "@/data/heroGreetings";

const HeroGreeting = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroGreetings.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-5 inline-flex h-7 items-center overflow-hidden rounded-full bg-primary/10 px-4">
      <AnimatePresence mode="wait">
        <motion.span
          key={heroGreetings[index]}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-primary"
        >
          {heroGreetings[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default HeroGreeting;