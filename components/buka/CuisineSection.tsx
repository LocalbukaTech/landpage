"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CuisineItem {
  name: string;
  image: string;
}

interface CuisineSectionProps {
  cuisines: CuisineItem[];
}

export function CuisineSection({ cuisines }: CuisineSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const updateScrollButtons = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons);
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [updateScrollButtons]);

  const scrollBy = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.clientWidth / 3;
    const amount = direction === "right" ? cardWidth * 3 : -(cardWidth * 3);
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeftPos.current = scrollRef.current?.scrollLeft || 0;
    if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Section Header */}
      <button className="flex items-center gap-2 group w-[92%] mx-auto">
        <h2 className="text-white text-xl font-bold">By Cuisine</h2>
        <ArrowRight size={20} className="text-white group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Cards Row */}
      <div className="flex items-center gap-3">
        {/* Left Arrow */}
        <div className="shrink-0 w-10">
          {canScrollLeft && (
            <button
              onClick={() => scrollBy("left")}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>

        {/* Scrollable Cuisine Cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 flex-1 overflow-x-auto cursor-grab select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
          {cuisines.map((cuisine) => {
            const slug = cuisine.name.toLowerCase().replace(/\s+/g, "-");
            return (
              <Link
                key={cuisine.name}
                href={`/buka/${slug}`}
                className="shrink-0 cursor-pointer group w-[403px]"
              >
                <div className="relative w-full h-[504px] rounded-2xl overflow-hidden">
                  <Image
                    src={cuisine.image}
                    alt={cuisine.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Dark gradient at bottom for label */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                  {/* Label */}
                  <span className="absolute bottom-4 left-4 text-white text-sm font-semibold">
                    {cuisine.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right Arrow */}
        <div className="shrink-0 w-10">
          {canScrollRight && (
            <button
              onClick={() => scrollBy("right")}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
