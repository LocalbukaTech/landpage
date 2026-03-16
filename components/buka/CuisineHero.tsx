"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface CuisineHeroProps {
  name: string;
  description: string;
  images: string[];
}

export function CuisineHero({ name, description, images }: CuisineHeroProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = useCallback(
    (index: number) => {
      setActiveIndex(index);
    },
    []
  );

  // Auto-advance carousel
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative w-full h-[800px] overflow-hidden rounded-b-2xl">
      {/* Images */}
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={img}
            alt={`${name} slide ${i + 1}`}
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-8 left-8 z-10 flex items-center justify-center w-10 h-10 rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors bg-transparent cursor-pointer"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Content */}
      <div className="absolute bottom-12 left-8 z-10 flex flex-col gap-3 max-w-md">
        <h1 className="text-white text-[28px] font-bold leading-tight">
          {name}
        </h1>
        <p className="text-white/80 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === activeIndex
                ? "bg-white w-6"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
