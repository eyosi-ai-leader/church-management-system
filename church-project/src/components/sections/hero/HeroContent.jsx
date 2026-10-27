"use client";

import { motion, useReducedMotion } from "framer-motion";
import HeroGreeting from "./HeroGreeting";
import HeroActions from "./HeroActions";
import heroContent from "@/data/heroContent";

const HeroContent = () => {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.15, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex h-full max-w-xl flex-col justify-center px-6 py-16 lg:px-16 lg:py-0"
    >
      <motion.div variants={item}>
        <HeroGreeting />
      </motion.div>

      <motion.h1
        variants={item}
        className="font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl lg:text-6xl"
      >
        {heroContent.headline}
        <br />
        <span className="text-primary">{heroContent.headlineAccent}</span>
      </motion.h1>

      <motion.p variants={item} className="mt-6 text-lg leading-relaxed text-body">
        {heroContent.description}
      </motion.p>

      <motion.p variants={item} className="mt-4 text-sm font-medium text-body">
        {heroContent.meta}
      </motion.p>

      <motion.div variants={item}>
        <HeroActions />
      </motion.div>

      {heroContent.facts?.length > 0 && (
        <motion.ul
          variants={item}
          className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-primary/15 pt-5 text-sm text-body"
        >
          {heroContent.facts.map((fact) => (
            <li key={fact} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {fact}
            </li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
};

export default HeroContent;