"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CarouselProps } from "@/types/carousel";
import { DEFAULT_CAROUSEL_CONFIG } from "@/constants/carouselConfig";
import { CarouselSlide } from "./CarouselSlide";
import { CarouselIndicators } from "./CarouselIndicators";

export function CarouselBuka({
    slides,
    autoplayInterval = DEFAULT_CAROUSEL_CONFIG.autoplayInterval,
    showIndicators = true,
    className = "",
}: CarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Navigate to next slide
    const goToNext = useCallback(() => {
        setActiveIndex((current) => (current + 1) % slides.length);
    }, [slides.length]);

    // Navigate to previous slide
    const goToPrevious = useCallback(() => {
        setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
    }, [slides.length]);

    // Navigate to specific slide
    const goToSlide = useCallback((index: number) => {
        setActiveIndex(index);
    }, []);

    // Autoplay logic
    useEffect(() => {
        if (isPaused || slides.length <= 1) return;

        autoplayTimerRef.current = setInterval(() => {
            goToNext();
        }, autoplayInterval);

        return () => {
            if (autoplayTimerRef.current) {
                clearInterval(autoplayTimerRef.current);
            }
        };
    }, [isPaused, autoplayInterval, goToNext, slides.length]);

    // Keyboard navigation
    useEffect(() => {
        if (!DEFAULT_CAROUSEL_CONFIG.enableKeyboard) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                goToPrevious();
            } else if (e.key === "ArrowRight") {
                goToNext();
            }
        };

        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener("keydown", handleKeyDown);
            return () => carousel.removeEventListener("keydown", handleKeyDown);
        }
    }, [goToNext, goToPrevious]);

    // Touch/swipe support
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!DEFAULT_CAROUSEL_CONFIG.enableSwipe) return;
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!DEFAULT_CAROUSEL_CONFIG.enableSwipe) return;
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!DEFAULT_CAROUSEL_CONFIG.enableSwipe) return;
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance) {
            goToNext();
        } else if (distance < -minSwipeDistance) {
            goToPrevious();
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    // Pause on hover
    const handleMouseEnter = () => {
        if (DEFAULT_CAROUSEL_CONFIG.pauseOnHover) {
            setIsPaused(true);
        }
    };

    const handleMouseLeave = () => {
        if (DEFAULT_CAROUSEL_CONFIG.pauseOnHover) {
            setIsPaused(false);
        }
    };

    return (
        <div
            ref={carouselRef}
            className={`relative h-[400px] w-full overflow-hidden md:h-[500px] lg:h-[600px] ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            tabIndex={0}
            role="region"
            aria-label="Image carousel"
            aria-live="polite"
        >
            {/* Slides */}
            {slides.map((slide, index) => (
                <CarouselSlide
                    key={slide.id}
                    slide={slide}
                    isActive={index === activeIndex}
                    index={index}
                />
            ))}

            {/* Indicators */}
            {showIndicators && slides.length > 1 && (
                <CarouselIndicators
                    total={slides.length}
                    activeIndex={activeIndex}
                    onIndicatorClick={goToSlide}
                />
            )}
        </div>
    );
}
