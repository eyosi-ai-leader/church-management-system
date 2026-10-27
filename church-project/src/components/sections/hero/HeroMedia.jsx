"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

import heroMedia from "@/data/heroMedia";
import heroContent from "@/data/heroContent";

import "swiper/css";
import "swiper/css/effect-fade";

const DELAY = 5500;

const HeroMedia = () => {
  const [swiper, setSwiper] = useState(null);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const total = heroMedia.length;
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="relative h-full w-full">
      {/* Seam accents */}
      <div className="absolute -left-2 top-16 z-10 h-4 w-4 bg-accent [clip-path:polygon(0_0,100%_50%,0_100%)] lg:top-24" />
      <div className="absolute -left-2 bottom-16 z-10 h-4 w-4 rotate-180 bg-primary [clip-path:polygon(0_0,100%_50%,0_100%)] lg:bottom-24" />

      {/* Floating info card (renders only if real data exists) */}
      {heroContent.nextService && (
        <div className="absolute -left-6 bottom-28 z-20 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-soft backdrop-blur lg:-left-10">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-body">
              {heroContent.nextService.label}
            </p>
            <p className="text-sm font-semibold text-ink">
              {heroContent.nextService.value}
            </p>
          </div>
        </div>
      )}

      <div className="relative h-full w-full overflow-hidden rounded-l-[120px] sm:rounded-l-[200px] lg:rounded-l-[340px]">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          loop
          autoplay={{
            delay: DELAY,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSwiper={setSwiper}
          onSlideChange={(s) => setActive(s.realIndex)}
          className="h-full w-full"
        >
          {heroMedia.map((image) => (
            <SwiperSlide key={image.id} className="group">
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={image.id === 1}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[7000ms] ease-out group-[.swiper-slide-active]:scale-110 motion-reduce:transform-none motion-reduce:transition-none"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Soft bottom shade so controls stay readable */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-40 bg-gradient-to-t from-black/35 to-transparent" />

        {/* Counter + progress */}
        <div className="absolute bottom-8 right-8 z-10 flex items-center gap-4 text-white">
          <span className="text-xs font-semibold tabular-nums tracking-widest">
            {pad(active + 1)} / {pad(total)}
          </span>
          <div className="flex gap-1.5" aria-hidden="true">
            {heroMedia.map((image, i) => (
              <span
                key={image.id}
                className="relative h-[3px] w-8 overflow-hidden rounded-full bg-white/35"
              >
                {i === active && (
                  <motion.span
                    key={`p-${active}`}
                    className="absolute inset-y-0 left-0 bg-white"
                    initial={{ width: reduceMotion ? "100%" : "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: reduceMotion ? 0 : DELAY / 1000,
                      ease: "linear",
                    }}
                  />
                )}
                {i < active && <span className="absolute inset-0 bg-white" />}
              </span>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => swiper?.slidePrev()}
          className="absolute left-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 text-ink shadow-soft transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => swiper?.slideNext()}
          className="absolute right-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 text-ink shadow-soft transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default HeroMedia;