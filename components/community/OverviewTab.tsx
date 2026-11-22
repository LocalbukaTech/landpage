"use client";

import { Users, CreditCard, Banknote, ChevronRight, ChevronDown } from "lucide-react";

interface OverviewTabProps {
  onNavigateToContent?: () => void;
  onNavigateToMembers?: () => void;
  onNavigateToEarnings?: () => void;
}

export function OverviewTab({
  onNavigateToMembers,
  onNavigateToEarnings,
}: OverviewTabProps) {
  return (
    <div className="w-full text-white space-y-4 sm:space-y-6 pt-1 max-w-[1012px]">
      {/* ── Top 3 Stat Cards Row (Screen 1 in Figma design) ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:flex md:flex-wrap md:gap-4">
        {/* 1. Total Members Card */}
        <div
          onClick={onNavigateToMembers}
          className="rounded-xl sm:rounded-2xl border border-white/8 bg-[#151517] p-2.5 sm:p-4 flex flex-col justify-between shadow-lg h-32 sm:h-36 md:h-40 md:w-[310px] md:flex-none cursor-pointer hover:border-white/15 transition-all group"
        >
          {/* Top icon + label */}
          <div className="flex items-center gap-1.5 text-[#f5c94d]">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 stroke-[2.2]" />
            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 truncate">
              Total members
            </span>
          </div>

          {/* Center Large Value */}
          <div className="my-0.5 sm:my-1">
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-none group-hover:text-[#f5c94d] transition-colors">
              2,143
            </span>
          </div>

          {/* Bottom Row: Percentage & Details > */}
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] md:text-xs">
            <span className="text-[#4ade80] font-semibold flex items-center gap-0.5 truncate">
              <span className="text-[8px] sm:text-[9px]">▲</span> + 8.3%
            </span>
            <span className="text-white/40 group-hover:text-white transition-colors flex items-center gap-0.5 font-medium shrink-0">
              Details <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
            </span>
          </div>
        </div>

        {/* 2. Recurring Subscription Card */}
        <div
          onClick={onNavigateToMembers}
          className="rounded-xl sm:rounded-2xl border border-white/8 bg-[#151517] p-2.5 sm:p-4 flex flex-col justify-between shadow-lg h-32 sm:h-36 md:h-40 md:w-[310px] md:flex-none cursor-pointer hover:border-white/15 transition-all group"
        >
          {/* Top icon + label */}
          <div className="flex items-center gap-1.5 text-[#f5c94d]">
            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 stroke-[2.2]" />
            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 truncate">
              Recurring subscription
            </span>
          </div>

          {/* Center Large Value */}
          <div className="my-0.5 sm:my-1">
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-none group-hover:text-[#f5c94d] transition-colors">
              1,500
            </span>
          </div>

          {/* Bottom Row: Percentage & Details > */}
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] md:text-xs">
            <span className="text-[#4ade80] font-semibold flex items-center gap-0.5 truncate">
              <span className="text-[8px] sm:text-[9px]">▲</span> + 12%
            </span>
            <span className="text-white/40 group-hover:text-white transition-colors flex items-center gap-0.5 font-medium shrink-0">
              Details <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
            </span>
          </div>
        </div>

        {/* 3. Gross Revenue Card */}
        <div
          onClick={onNavigateToEarnings}
          className="rounded-xl sm:rounded-2xl border border-white/8 bg-[#151517] p-2.5 sm:p-4 flex flex-col justify-between shadow-lg h-32 sm:h-36 md:h-40 md:w-[310px] md:flex-none cursor-pointer hover:border-white/15 transition-all group"
        >
          {/* Top icon + label */}
          <div className="flex items-center gap-1.5 text-[#f5c94d]">
            <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 stroke-[2.2]" />
            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 truncate">
              Gross Revenue
            </span>
          </div>

          {/* Center Large Value */}
          <div className="my-0.5 sm:my-1">
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-none group-hover:text-[#f5c94d] transition-colors">
              3.5m
            </span>
          </div>

          {/* Bottom Row: Percentage & Details > */}
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] md:text-xs">
            <span className="text-[#4ade80] font-semibold flex items-center gap-0.5 truncate">
              <span className="text-[8px] sm:text-[9px]">▲</span> + 8.3%
            </span>
            <span className="text-white/40 group-hover:text-white transition-colors flex items-center gap-0.5 font-medium shrink-0">
              Details <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
            </span>
          </div>
        </div>
      </div>

      {/* ── Performance Chart Section (Screen 1 in Figma design) ── */}
      <div className="space-y-3 pt-1">
        <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white">
          Performance
        </h2>

        {/* Performance Chart Card */}
        <div className="w-full rounded-2xl md:rounded-[22px] bg-[#0f0f11] border border-white/8 p-3.5 sm:p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          {/* Top Header of Chart Card */}
          <div className="flex items-center justify-between w-full mb-2 sm:mb-3">
            {/* Left: Performance dropdown */}
            <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-white/90">
              <span>Performance</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/50" />
            </div>

            {/* Right: Time Range Selector */}
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-white/70 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
              <span>1Y</span>
              <ChevronDown className="w-3 h-3 text-white/50" />
            </div>
          </div>

          {/* SVG Chart Area */}
          <div className="relative w-full my-1 sm:my-2">
            <svg
              width="100%"
              viewBox="0 0 520 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-44 sm:h-56 md:h-64 overflow-visible"
            >
              <defs>
                {/* Golden Area Gradient */}
                <linearGradient
                  id="goldAreaGradient"
                  x1="260"
                  y1="45"
                  x2="260"
                  y2="165"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#f5c94d" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#f5c94d" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#f5c94d" stopOpacity="0.0" />
                </linearGradient>

                {/* Subtle Glow Filter for Curve */}
                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#f5c94d" floodOpacity="0.45" />
                </filter>
              </defs>

              {/* Faint Horizontal Dashed Grid Lines */}
              <line x1="45" y1="45" x2="495" y2="45" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="45" y1="85" x2="495" y2="85" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="45" y1="125" x2="495" y2="125" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="45" y1="165" x2="495" y2="165" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

              {/* Left Y-axis labels */}
              <text x="20" y="49" fill="rgba(255,255,255,0.25)" fontSize="9" fontWeight="500">2M</text>
              <text x="20" y="89" fill="rgba(255,255,255,0.25)" fontSize="9" fontWeight="500">1.5M</text>
              <text x="20" y="129" fill="rgba(255,255,255,0.25)" fontSize="9" fontWeight="500">1M</text>
              <text x="25" y="169" fill="rgba(255,255,255,0.25)" fontSize="9" fontWeight="500">0</text>

              {/* Area Under Curve */}
              <path
                d="M 50 152 C 85 149, 95 146, 118 144 C 148 141, 165 137, 188 134 C 218 131, 235 128, 258 124 C 288 119, 305 112, 328 100 C 362 82, 388 48, 408 48 C 428 48, 452 70, 478 94 L 478 165 L 50 165 Z"
                fill="url(#goldAreaGradient)"
              />

              {/* Glowing Golden Stroke Curve */}
              <path
                d="M 50 152 C 85 149, 95 146, 118 144 C 148 141, 165 137, 188 134 C 218 131, 235 128, 258 124 C 288 119, 305 112, 328 100 C 362 82, 388 48, 408 48 C 428 48, 452 70, 478 94"
                stroke="#f5c94d"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#goldGlow)"
              />

              {/* Vertical Dashed Line at Peak (August, x = 408) */}
              <line
                x1="408"
                y1="48"
                x2="408"
                y2="165"
                stroke="#f5c94d"
                strokeOpacity="0.45"
                strokeDasharray="2.5 2.5"
                strokeWidth="1"
              />

              {/* Glowing Dot on Peak */}
              <circle cx="408" cy="48" r="6" fill="#f5c94d" fillOpacity="0.3" />
              <circle cx="408" cy="48" r="3.5" fill="#ffffff" stroke="#f5c94d" strokeWidth="2" />

              {/* Tooltip Badge above Peak */}
              <g transform="translate(408, 24)">
                <rect
                  x="-23"
                  y="-15"
                  width="46"
                  height="18"
                  rx="4"
                  fill="#1c1c1f"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="0.8"
                />
                <polygon points="-3,3 3,3 0,6" fill="#1c1c1f" />
                <text x="0" y="-3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">
                  3.5m
                </text>
              </g>

              {/* X-Axis Month Labels (Mar, Apr, May, Jun, Jul, Aug, Sep) */}
              <text x="50" y="192" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="500">
                Mar
              </text>
              <text x="118" y="192" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="500">
                Apr
              </text>
              <text x="188" y="192" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="500">
                May
              </text>
              <text x="258" y="192" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="500">
                Jun
              </text>
              <text x="328" y="192" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="500">
                Jul
              </text>
              {/* Highlighted August Month */}
              <text x="408" y="192" textAnchor="middle" fill="#f5c94d" fontSize="10.5" fontWeight="700">
                Aug
              </text>
              <text x="478" y="192" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="500">
                Sep
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
