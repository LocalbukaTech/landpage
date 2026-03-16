"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    Search,
    CalendarDays,
    SlidersHorizontal,
    Upload,
    X,
    MapPin,
    ShieldAlert,
    Flag,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DateRange {
    from: string;
    to: string;
}

export interface FilterState {
    location: string | null;
    status: string | null;
    flagReason: string | null;
}

export const EMPTY_FILTERS: FilterState = { location: null, status: null, flagReason: null };

interface UserFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filters: FilterState;
    dateRange: DateRange | null;
    activeFilterCount: number;
    filteredResultCount: number;
    totalResultCount: number;
    onDateChange: (range: DateRange | null) => void;
    onFilterChange: (filters: FilterState) => void;
    onClearFilters: () => void;
    onExport?: (format: "csv" | "excel") => void;
    showFlagReasonFilter?: boolean;
    searchPlaceholder?: string;
}

// ── Reusable hooks ──
function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void, active: boolean) {
    useEffect(() => {
        if (!active) return;
        const handle = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [active, ref, onClose]);
}

// ── Calendar helpers ──
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}
function toDateStr(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function isSameDay(a: string, b: string) {
    return a === b;
}
function isInRange(day: string, from: string, to: string) {
    return day >= from && day <= to;
}
function formatDisplayDate(dateStr: string) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/* ═══════════════════════════════════════════
   Custom Date Range Picker
   ═══════════════════════════════════════════ */
function DateDropdown({
    initial,
    onApply,
    onClear,
    onClose,
}: {
    initial: DateRange | null;
    onApply: (range: DateRange) => void;
    onClear: () => void;
    onClose: () => void;
}) {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    // Selection state: "from" is picked first, "to" second
    const [selectingFrom, setSelectingFrom] = useState(true);
    const [from, setFrom] = useState(initial?.from ?? "");
    const [to, setTo] = useState(initial?.to ?? "");
    const [hoveredDay, setHoveredDay] = useState("");

    const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

    // ── Navigation ──
    const prevMonth = () => {
        setViewMonth((m) => {
            if (m === 0) { setViewYear((y) => y - 1); return 11; }
            return m - 1;
        });
    };
    const nextMonth = () => {
        setViewMonth((m) => {
            if (m === 11) { setViewYear((y) => y + 1); return 0; }
            return m + 1;
        });
    };

    // ── Day click ──
    const handleDayClick = (dateStr: string) => {
        if (selectingFrom) {
            setFrom(dateStr);
            setTo("");
            setSelectingFrom(false);
        } else {
            // If clicked date is before "from", swap
            if (dateStr < from) {
                setTo(from);
                setFrom(dateStr);
            } else {
                setTo(dateStr);
            }
            setSelectingFrom(true);
        }
    };

    // ── Quick presets ──
    const applyPreset = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        const f = toDateStr(start.getFullYear(), start.getMonth(), start.getDate());
        const t = toDateStr(end.getFullYear(), end.getMonth(), end.getDate());
        setFrom(f);
        setTo(t);
        setSelectingFrom(true);
    };

    // ── Build calendar grid ──
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const calendarDays: (string | null)[] = [];

    // Leading blanks
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
        calendarDays.push(toDateStr(viewYear, viewMonth, d));
    }

    // Determine display range for highlighting
    const rangeFrom = from;
    const rangeTo = to || (hoveredDay && !selectingFrom ? hoveredDay : "");
    const effectiveFrom = rangeFrom && rangeTo && rangeFrom > rangeTo ? rangeTo : rangeFrom;
    const effectiveTo = rangeFrom && rangeTo && rangeFrom > rangeTo ? rangeFrom : rangeTo;

    const canApply = from && to;

    return (
        <div className="absolute right-0 top-full mt-2 w-[340px] bg-white rounded-xl border border-zinc-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-4 pb-3 border-b border-zinc-100">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-zinc-800">Select Date Range</h3>
                    <button
                        onClick={onClose}
                        className="w-6 h-6 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Selected range display */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSelectingFrom(true)}
                        className={cn(
                            "flex-1 py-2 px-3 rounded-lg text-xs font-medium text-center transition-all border",
                            selectingFrom
                                ? "border-[#fbbe15] bg-[#fbbe15]/10 text-[#1a1a1a] shadow-sm"
                                : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-zinc-300"
                        )}
                    >
                        {from ? formatDisplayDate(from) : "Start date"}
                    </button>
                    <div className="flex-shrink-0 w-6 h-px bg-zinc-300" />
                    <button
                        onClick={() => { if (from) setSelectingFrom(false); }}
                        className={cn(
                            "flex-1 py-2 px-3 rounded-lg text-xs font-medium text-center transition-all border",
                            !selectingFrom
                                ? "border-[#fbbe15] bg-[#fbbe15]/10 text-[#1a1a1a] shadow-sm"
                                : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-zinc-300"
                        )}
                    >
                        {to ? formatDisplayDate(to) : "End date"}
                    </button>
                </div>
            </div>

            {/* Quick presets */}
            <div className="px-5 py-2.5 border-b border-zinc-100 flex items-center gap-1.5 overflow-x-auto">
                {[
                    { label: "7 days", days: 7 },
                    { label: "14 days", days: 14 },
                    { label: "30 days", days: 30 },
                    { label: "90 days", days: 90 },
                ].map((preset) => (
                    <button
                        key={preset.days}
                        onClick={() => applyPreset(preset.days)}
                        className="flex-shrink-0 px-2.5 py-1 text-[11px] font-medium rounded-md border border-zinc-200 text-zinc-500 hover:border-[#fbbe15] hover:text-[#1a1a1a] hover:bg-[#fbbe15]/5 transition-all"
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {/* Calendar */}
            <div className="px-5 py-3">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-3">
                    <button
                        onClick={prevMonth}
                        className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-semibold text-zinc-700">
                        {MONTHS[viewMonth]} {viewYear}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-1">
                    {WEEKDAYS.map((d) => (
                        <div key={d} className="text-center text-[10px] font-semibold text-zinc-400 py-1 uppercase tracking-wider">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Day grid */}
                <div className="grid grid-cols-7">
                    {calendarDays.map((dayStr, idx) => {
                        if (!dayStr) {
                            return <div key={`blank-${idx}`} className="aspect-square" />;
                        }

                        const dayNum = parseInt(dayStr.split("-")[2], 10);
                        const isToday = isSameDay(dayStr, todayStr);
                        const isStart = from && isSameDay(dayStr, from);
                        const isEnd = to && isSameDay(dayStr, to);
                        const inRange = effectiveFrom && effectiveTo && isInRange(dayStr, effectiveFrom, effectiveTo);
                        const isEdge = isStart || isEnd;

                        return (
                            <div
                                key={dayStr}
                                className={cn(
                                    "relative flex items-center justify-center",
                                    // Range background band (spans full cell width)
                                    inRange && !isEdge && "bg-[#fbbe15]/10",
                                    isStart && to && "bg-gradient-to-r from-transparent to-[#fbbe15]/10 rounded-l-full",
                                    isEnd && from && "bg-gradient-to-l from-transparent to-[#fbbe15]/10 rounded-r-full",
                                )}
                            >
                                <button
                                    onClick={() => handleDayClick(dayStr)}
                                    onMouseEnter={() => setHoveredDay(dayStr)}
                                    onMouseLeave={() => setHoveredDay("")}
                                    className={cn(
                                        "w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium transition-all relative",
                                        isEdge
                                            ? "bg-[#fbbe15] text-[#1a1a1a] font-bold shadow-sm"
                                            : isToday
                                                ? "text-[#fbbe15] font-bold"
                                                : "text-zinc-600 hover:bg-zinc-100"
                                    )}
                                >
                                    {dayNum}
                                    {isToday && !isEdge && (
                                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#fbbe15]" />
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50/50 flex items-center gap-2">
                {initial && (
                    <button
                        onClick={() => { onClear(); onClose(); }}
                        className="flex-1 py-2 text-xs font-medium rounded-lg border border-zinc-200 text-zinc-600 hover:bg-white hover:border-zinc-300 transition-all"
                    >
                        Clear
                    </button>
                )}
                <button
                    onClick={() => {
                        if (canApply) {
                            onApply({ from, to });
                            onClose();
                        }
                    }}
                    disabled={!canApply}
                    className={cn(
                        "py-2 text-xs font-semibold rounded-lg transition-all",
                        canApply
                            ? "bg-[#fbbe15] text-[#1a1a1a] hover:bg-[#e5ab0e] shadow-sm"
                            : "bg-zinc-100 text-zinc-400 cursor-not-allowed",
                        initial ? "flex-1" : "w-full"
                    )}
                >
                    Apply Range
                </button>
            </div>
        </div>
    );
}

/* ─── Filters Dropdown ─── */
const locationOptions = ["All", "Lagos, Nigeria", "Abuja, Nigeria", "London, UK", "Accra, Ghana", "New York, USA", "Nairobi, Kenya"];
const statusOptions = ["All", "Active", "Flagged", "Banned"];
const flagReasonOptions = ["All", "High Follow Rate", "Duplicate IP", "Suspicious IP", "Fake email domain", "VPN detected", "Multiple accounts", "Bot behavior"];

function FiltersDropdown({
    filters,
    onChange,
    onClose,
    showFlagReason = true,
}: {
    filters: FilterState;
    onChange: (f: FilterState) => void;
    onClose: () => void;
    showFlagReason?: boolean;
}) {
    const [local, setLocal] = useState<FilterState>(filters);

    const update = (key: keyof FilterState, value: string) => {
        setLocal((prev) => ({ ...prev, [key]: value === "All" ? null : value }));
    };

    return (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg border border-zinc-200 shadow-lg p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-zinc-700">Filters</span>
                <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                    <X size={14} />
                </button>
            </div>

            <div className="space-y-3">
                {/* Location */}
                <label className="block">
                    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                        <MapPin size={12} /> Location
                    </span>
                    <select
                        value={local.location ?? "All"}
                        onChange={(e) => update("location", e.target.value)}
                        className="w-full text-sm border border-zinc-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#fbbe15]/40 focus:border-[#fbbe15] text-zinc-700 bg-white"
                    >
                        {locationOptions.map((o) => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                    </select>
                </label>

                {/* Status */}
                <label className="block">
                    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                        <ShieldAlert size={12} /> Status
                    </span>
                    <select
                        value={local.status ?? "All"}
                        onChange={(e) => update("status", e.target.value)}
                        className="w-full text-sm border border-zinc-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#fbbe15]/40 focus:border-[#fbbe15] text-zinc-700 bg-white"
                    >
                        {statusOptions.map((o) => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                    </select>
                </label>

                {/* Flag Reason */}
                {showFlagReason && (
                <label className="block">
                    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                        <Flag size={12} /> System Flag Reason
                    </span>
                    <select
                        value={local.flagReason ?? "All"}
                        onChange={(e) => update("flagReason", e.target.value)}
                        className="w-full text-sm border border-zinc-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#fbbe15]/40 focus:border-[#fbbe15] text-zinc-700 bg-white"
                    >
                        {flagReasonOptions.map((o) => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                    </select>
                </label>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                    <button
                        onClick={() => {
                            const reset = { location: null, status: null, flagReason: null };
                            setLocal(reset);
                            onChange(reset);
                        }}
                        className="flex-1 py-1.5 text-sm rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={() => {
                            onChange(local);
                            onClose();
                        }}
                        className="flex-1 py-1.5 text-sm font-medium rounded-md bg-[#fbbe15] text-[#1a1a1a] hover:bg-[#fbbe15]/90 transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Export Dropdown ─── */
function ExportDropdown({ onExport, onClose }: { onExport: (format: "csv" | "excel") => void; onClose: () => void }) {
    return (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg border border-zinc-200 shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <button
                onClick={() => { onExport("csv"); onClose(); }}
                className="w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
                Export as CSV
            </button>
            <button
                onClick={() => { onExport("excel"); onClose(); }}
                className="w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
                Export as Excel
            </button>
        </div>
    );
}

/* ═══════════════════════════════════════════
   Main UserFilters Component
   ═══════════════════════════════════════════ */
export function UserFilters({
    searchQuery,
    onSearchChange,
    filters,
    dateRange,
    activeFilterCount,
    filteredResultCount,
    totalResultCount,
    onDateChange,
    onFilterChange,
    onClearFilters,
    onExport,
    showFlagReasonFilter = true,
    searchPlaceholder = "Search by email or ID",
}: UserFiltersProps) {
    const [openMenu, setOpenMenu] = useState<"date" | "filters" | "export" | null>(null);

    const dateRef = useRef<HTMLDivElement>(null);
    const filtersRef = useRef<HTMLDivElement>(null);
    const exportRef = useRef<HTMLDivElement>(null);

    const close = useCallback(() => setOpenMenu(null), []);

    useClickOutside(dateRef, close, openMenu === "date");
    useClickOutside(filtersRef, close, openMenu === "filters");
    useClickOutside(exportRef, close, openMenu === "export");

    const hasAnyFilter = activeFilterCount > 0 || !!dateRange || searchQuery.trim().length > 0;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full py-2.5 pl-10 pr-4 text-sm text-zinc-700 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-200 placeholder:text-zinc-400 transition-all"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    {/* Date */}
                    <div ref={dateRef} className="relative">
                        <button
                            onClick={() => setOpenMenu(openMenu === "date" ? null : "date")}
                            className={cn(
                                "flex items-center gap-1.5 text-sm transition-colors",
                                openMenu === "date" || dateRange
                                    ? "text-zinc-800"
                                    : "text-zinc-500 hover:text-zinc-700"
                            )}
                        >
                            <CalendarDays size={16} />
                            <span className="hidden sm:inline">Date</span>
                            {dateRange && (
                                <span className="ml-0.5 w-2 h-2 rounded-full bg-[#fbbe15]" />
                            )}
                        </button>
                        {openMenu === "date" && (
                            <DateDropdown
                                initial={dateRange}
                                onApply={(range) => onDateChange(range)}
                                onClear={() => onDateChange(null)}
                                onClose={close}
                            />
                        )}
                    </div>

                    {/* Filters */}
                    <div ref={filtersRef} className="relative">
                        <button
                            onClick={() => setOpenMenu(openMenu === "filters" ? null : "filters")}
                            className={cn(
                                "flex items-center gap-1.5 text-sm transition-colors",
                                openMenu === "filters" || activeFilterCount > 0
                                    ? "text-zinc-800"
                                    : "text-zinc-500 hover:text-zinc-700"
                            )}
                        >
                            <SlidersHorizontal size={16} />
                            <span className="hidden sm:inline">Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-[#fbbe15] text-[10px] font-bold text-[#1a1a1a]">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                        {openMenu === "filters" && (
                            <FiltersDropdown
                                filters={filters}
                                onChange={onFilterChange}
                                onClose={close}
                                showFlagReason={showFlagReasonFilter}
                            />
                        )}
                    </div>

                    {/* Export */}
                    <div ref={exportRef} className="relative">
                        <button
                            onClick={() => setOpenMenu(openMenu === "export" ? null : "export")}
                            className={cn(
                                "flex items-center gap-1.5 text-sm transition-colors",
                                openMenu === "export" ? "text-zinc-800" : "text-zinc-500 hover:text-zinc-700"
                            )}
                        >
                            <Upload size={16} />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                        {openMenu === "export" && (
                            <ExportDropdown
                                onExport={(fmt) => onExport?.(fmt)}
                                onClose={close}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Active filter info bar */}
            {hasAnyFilter && (
                <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>
                        Showing <span className="font-semibold text-zinc-700">{filteredResultCount}</span> of{" "}
                        <span className="font-semibold text-zinc-700">{totalResultCount}</span> users
                    </span>
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 transition-colors"
                    >
                        <X size={12} />
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}
