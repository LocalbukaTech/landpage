"use client";

import { CarouselIndicatorsProps } from "@/types/carousel";

export function CarouselIndicators({
    total,
    activeIndex,
    onIndicatorClick,
}: CarouselIndicatorsProps) {
    return (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {Array.from({ length: total }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => onIndicatorClick(index)}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${index === activeIndex
                        ? "bg-white"
                        : "bg-white/40 hover:bg-white/60"
                        }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === activeIndex ? "true" : "false"}
                />
            ))}
        </div>
    );
}
