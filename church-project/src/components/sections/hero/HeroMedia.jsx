"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import heroMedia from "@/data/heroMedia";

import "swiper/css";
import "swiper/css/effect-fade";

const HeroMedia = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);

  return (
    <div className="relative h-full w-full">
      {/* Decorative seam accents */}
      <div className="absolute -left-2 top-16 z-10 h-4 w-4 bg-accent [clip-path:polygon(0_0,100%_50%,0_100%)] lg:top-24" />
      <div className="absolute -left-2 bottom-16 z-10 h-4 w-4 rotate-180 bg-primary [clip-path:polygon(0_0,100%_50%,0_100%)] lg:bottom-24" />

      <div className="relative h-full w-full overflow-hidden rounded-l-[120px] sm:rounded-l-[200px] lg:rounded-l-[340px]">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          loop
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          onSwiper={setSwiperInstance}
          className="h-full w-full"
        >
          {heroMedia.map((image) => (
            <SwiperSlide key={image.id}>
              <div className="relative h-full w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={image.id === 1}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom nav */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => swiperInstance?.slidePrev()}
          className="absolute left-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 text-ink shadow-soft transition hover:bg-accent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Next slide"
          onClick={() => swiperInstance?.slideNext()}
          className="absolute right-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 text-ink shadow-soft transition hover:bg-accent"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default HeroMedia;