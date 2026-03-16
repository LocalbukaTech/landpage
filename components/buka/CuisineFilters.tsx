"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Star, Search } from "lucide-react";
import Image from "next/image";

interface CuisineFiltersProps {
  activeCuisine?: string;
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  minPrice: string;
  maxPrice: string;
  rating: number | null;
  foodQuality: number | null;
  cuisines: string[];
}

const CUISINE_OPTIONS = [
  "Nigerian Cuisine",
  "Yoruba Cuisine",
  "Igbo Cuisine",
  "Hausa Cuisine",
  "Edo Cuisine",
  "Efik Cuisine",
  "Urhobo Cuisine",
  "Intercontinental Cuisine",
];

const PRICE_MIN = 0;
const PRICE_MAX = 10000;

/* ── Star Rating Row ── */
function StarRating({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {[5, 4, 3, 2, 1].map((stars) => (
        <button
          key={stars}
          onClick={() => onChange(value === stars ? 0 : stars)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors w-fit cursor-pointer ${
            value === stars ? "bg-white/10" : "hover:bg-white/5"
          }`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < stars
                  ? "text-[#fbbe15] fill-[#fbbe15]"
                  : "text-zinc-600"
              }
            />
          ))}
        </button>
      ))}
    </div>
  );
}

/* ── Dual-Range Price Slider ── */
function PriceRangeSlider({
  minVal,
  maxVal,
  onMinChange,
  onMaxChange,
}: {
  minVal: number;
  maxVal: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"min" | "max" | null>(null);

  const toPercent = (v: number) =>
    ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const clamp = (v: number, lo: number, hi: number) =>
    Math.min(hi, Math.max(lo, v));

  const valFromEvent = useCallback((clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = (clientX - rect.left) / rect.width;
    return Math.round(clamp(pct * (PRICE_MAX - PRICE_MIN) + PRICE_MIN, PRICE_MIN, PRICE_MAX));
  }, []);

  const handlePointerDown = (thumb: "min" | "max") => (e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = thumb;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const v = valFromEvent(e.clientX);
      if (dragging.current === "min") {
        onMinChange(Math.min(v, maxVal - 100));
      } else {
        onMaxChange(Math.max(v, minVal + 100));
      }
    },
    [valFromEvent, minVal, maxVal, onMinChange, onMaxChange]
  );

  const handlePointerUp = () => {
    dragging.current = null;
  };

  const leftPct = toPercent(minVal);
  const rightPct = toPercent(maxVal);

  return (
    <div
      className="relative w-full h-6 flex items-center select-none touch-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Track background */}
      <div
        ref={trackRef}
        className="absolute left-0 right-0 h-[6px] rounded-full bg-zinc-700"
      />
      {/* Active range */}
      <div
        className="absolute h-[6px] rounded-full bg-green-500"
        style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
      />
      {/* Min thumb */}
      <div
        onPointerDown={handlePointerDown("min")}
        className="absolute w-4 h-4 rounded-full bg-green-500 border-2 border-white cursor-grab active:cursor-grabbing z-10 -translate-x-1/2"
        style={{ left: `${leftPct}%` }}
      />
      {/* Max thumb */}
      <div
        onPointerDown={handlePointerDown("max")}
        className="absolute w-4 h-4 rounded-full bg-green-500 border-2 border-white cursor-grab active:cursor-grabbing z-10 -translate-x-1/2"
        style={{ left: `${rightPct}%` }}
      />
    </div>
  );
}

/* ── Main Filter Component ── */
export function CuisineFilters({ activeCuisine, onFilterChange }: CuisineFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    minPrice: "",
    maxPrice: "",
    rating: null,
    foodQuality: null,
    cuisines: activeCuisine ? [activeCuisine] : [],
  });

  const [sliderMin, setSliderMin] = useState(PRICE_MIN);
  const [sliderMax, setSliderMax] = useState(PRICE_MAX);

  const updateFilter = (updates: Partial<FilterState>) => {
    const updated = { ...filters, ...updates };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  const toggleCuisine = (cuisine: string) => {
    const updated = filters.cuisines.includes(cuisine)
      ? filters.cuisines.filter((c) => c !== cuisine)
      : [...filters.cuisines, cuisine];
    updateFilter({ cuisines: updated });
  };

  const clearFilters = () => {
    const cleared: FilterState = {
      minPrice: "",
      maxPrice: "",
      rating: null,
      foodQuality: null,
      cuisines: [],
    };
    setFilters(cleared);
    setSliderMin(PRICE_MIN);
    setSliderMax(PRICE_MAX);
    onFilterChange?.(cleared);
  };

  // Sync slider → text inputs
  const handleSliderMinChange = (v: number) => {
    setSliderMin(v);
    updateFilter({ minPrice: String(v) });
  };
  const handleSliderMaxChange = (v: number) => {
    setSliderMax(v);
    updateFilter({ maxPrice: String(v) });
  };

  // Sync text inputs → slider
  const handleMinInputChange = (val: string) => {
    updateFilter({ minPrice: val });
    const n = parseInt(val, 10);
    if (!isNaN(n)) setSliderMin(Math.min(n, sliderMax - 100));
  };
  const handleMaxInputChange = (val: string) => {
    updateFilter({ maxPrice: val });
    const n = parseInt(val, 10);
    if (!isNaN(n)) setSliderMax(Math.max(n, sliderMin + 100));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-white text-sm font-semibold">Filter</span>
        <button
          onClick={clearFilters}
          className="text-zinc-400 text-xs hover:text-white transition-colors cursor-pointer"
        >
          Clear filters
        </button>
      </div>

      {/* ── Price ── */}
      <div className="flex flex-col gap-3">
        <span className="text-[#fbbe15] text-xs font-semibold">Price</span>

        {/* Range slider */}
        <PriceRangeSlider
          minVal={sliderMin}
          maxVal={sliderMax}
          onMinChange={handleSliderMinChange}
          onMaxChange={handleSliderMaxChange}
        />

        {/* Min / Max inputs */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-zinc-400 text-[10px] mb-1 block">Min. Price (₦)</label>
            <input
              type="text"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => handleMinInputChange(e.target.value)}
              className="w-full h-9 px-3 text-xs text-white bg-transparent border border-zinc-600 rounded-lg outline-none focus:border-[#fbbe15] transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="text-zinc-400 text-[10px] mb-1 block">Max. Price (₦)</label>
            <input
              type="text"
              placeholder="10000"
              value={filters.maxPrice}
              onChange={(e) => handleMaxInputChange(e.target.value)}
              className="w-full h-9 px-3 text-xs text-white bg-transparent border border-zinc-600 rounded-lg outline-none focus:border-[#fbbe15] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ── Rating ── */}
      <div className="flex flex-col gap-3">
        <span className="text-[#fbbe15] text-xs font-semibold">Rating</span>
        <StarRating
          value={filters.rating}
          onChange={(v) => updateFilter({ rating: v === 0 ? null : v })}
        />
      </div>

      {/* ── Food Quality ── */}
      <div className="flex flex-col gap-3">
        <span className="text-[#fbbe15] text-xs font-semibold">Food Quality</span>
        <StarRating
          value={filters.foodQuality}
          onChange={(v) => updateFilter({ foodQuality: v === 0 ? null : v })}
        />
      </div>

      {/* ── Cuisine ── */}
      <div className="flex flex-col gap-3">
        <span className="text-[#fbbe15] text-xs font-semibold">Cuisine</span>
        <div className="flex flex-col gap-2">
          {CUISINE_OPTIONS.map((cuisine) => (
            <label
              key={cuisine}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div
                onClick={() => toggleCuisine(cuisine)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  filters.cuisines.includes(cuisine)
                    ? "bg-[#fbbe15] border-[#fbbe15]"
                    : "border-zinc-600 group-hover:border-zinc-400"
                }`}
              >
                {filters.cuisines.includes(cuisine) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="#1a1a1a"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-white text-xs">{cuisine}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Ask BukaGenie ── */}
      <div className="flex items-center gap-2 h-11 px-3 bg-white/90 rounded-lg overflow-hidden">
        <Image
          src="/images/localBuka_logo.png"
          alt="BukaGenie"
          width={28}
          height={28}
          className="w-7 h-7 rounded-full shrink-0 object-cover"
        />
        <input
          type="text"
          placeholder="Ask BukaGenie"
          className="flex-1 min-w-0 bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
        />
        <Search size={16} className="text-zinc-400 shrink-0" />
      </div>

      {/* ── List a Restaurant CTA ── */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col gap-1">
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-green-600 flex items-center justify-center shrink-0 mt-0.5">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 2V8M2 5H8" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-green-900 text-xs font-semibold leading-tight">
              You found a great restaurant?
            </p>
            <p className="text-green-700 text-[11px] leading-tight">
              List it now on LocalBuka!
            </p>
          </div>
        </div>
        <button className="mt-2 w-fit py-2 px-5 bg-green-800 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
          List a Restaurant
        </button>
      </div>
    </div>
  );
}
