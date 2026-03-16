"use client";

import Image from "next/image";
import { CarouselSlideProps } from "@/types/carousel";
import { ArrowLeft } from "lucide-react";

export function CarouselSlide({ slide, isActive, index }: CarouselSlideProps) {
    return (
        <div
            className={`absolute inset-0 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"
                }`}
            aria-hidden={!isActive}
        >
            {/* Full-Width Background Image */}
            <div className="relative h-full w-full">
                <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="100vw"
                    quality={95}
                />
            </div>

            {/* Left-to-Right Dark Gradient Overlay (Full) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

            {/* Back Arrow - Top Left */}
            <button
                className="absolute left-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/80 bg-transparent text-white transition-all hover:bg-white/10 md:left-8 md:top-8"
                aria-label="Go back"
            >
                <ArrowLeft className="h-5 w-5" />
            </button>

            {/* Text Content - Bottom Left with Additional Gradient */}
            {(slide.title || slide.description) && (
                <div className="absolute bottom-12 left-6 right-6 md:bottom-16 md:left-12 md:right-auto md:max-w-md lg:bottom-20 lg:left-16 lg:max-w-lg">
                    {/* Additional subtle gradient behind text for extra readability */}
                    <div className="absolute -inset-4 -z-10 rounded-lg bg-gradient-to-r from-black/50 to-transparent blur-sm" />

                    {slide.title && (
                        <h2 className="mb-2 text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
                            {slide.title}
                        </h2>
                    )}
                    {slide.description && (
                        <p className="text-sm leading-relaxed text-white/90 drop-shadow-md md:text-base lg:text-lg">
                            {slide.description}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
