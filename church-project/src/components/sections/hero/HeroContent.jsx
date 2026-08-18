"use client";

import { motion } from "framer-motion";
import HeroGreeting from "./HeroGreeting";
import HeroActions from "./HeroActions";
import heroContent from "@/data/heroContent";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const HeroContent = () => {
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
    </motion.div>
  );
};

export default HeroContent;