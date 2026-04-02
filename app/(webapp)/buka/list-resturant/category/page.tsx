"use client";

import { useState, useEffect } from "react";
import { Search, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const REGIONS = [
    "African",
    "Asian",
    "European",
    "American",
    "Middle Eastern",
];

const AFRICAN_REGIONS = [
    "West African",
    "East African",
    "North African",
    "Central African",
    "Southern African",
];

const WEST_AFRICAN_REGIONS = [
    "Nigerian",
    "Ghanaian",
    "Senegalese",
    "Ivorian (Côte d'Ivoire)",
    "Sierra Leonean",
];

const NIGERIAN_CUISINES = [
    "Yoruba",
    "Igbo",
    "Hausa Cuisine",
    "Edo Cuisine",
    "Efik Cuisine",
    "Efik Cuisine ",
];

type CategoryView = 'global' | 'african' | 'west-african' | 'cuisines';

export default function CategorySelection() {
    const router = useRouter();
    const [view, setView] = useState<CategoryView>('global');
    const [searchQuery, setSearchQuery] = useState("");
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("selectedCuisines");
        if (saved) {
            try {
                setSelected(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse selected cuisines", e);
            }
        }
    }, []);

    const toggleCategory = (category: string) => {
        setSelected((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handleApply = () => {
        localStorage.setItem("selectedCuisines", JSON.stringify(selected));
        router.back();
    };

    const handleCancel = () => {
        router.back();
    };

    const handleBack = () => {
        if (view === 'african') setView('global');
        else if (view === 'west-african') setView('african');
        else if (view === 'cuisines') setView('west-african');
        else router.back();
        setSearchQuery("");
    };

    const getFilteredList = () => {
        const query = searchQuery.toLowerCase();
        if (view === 'global') return REGIONS.filter(r => r.toLowerCase().includes(query));
        if (view === 'african') return AFRICAN_REGIONS.filter(r => r.toLowerCase().includes(query));
        if (view === 'west-african') return WEST_AFRICAN_REGIONS.filter(r => r.toLowerCase().includes(query));
        return NIGERIAN_CUISINES.filter(c => c.toLowerCase().includes(query));
    };

    const list = getFilteredList();

    return (
        <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center pt-8 pb-12 font-[var(--font-nunito-sans)] px-4">

            {/* Breadcrumb outside the card */}
            <div className="w-full max-w-xl self-center px-4 mb-4" style={{ maxWidth: '640px' }}>
                <p className="text-zinc-400 text-lg font-medium transition-all duration-300">
                    Category{view !== 'global' && '/Africa/Popular Categories'}
                </p>
            </div>

            <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col transition-all duration-300" style={{ maxWidth: '640px', minHeight: '700px' }}>
                {/* Header */}
                <div className="flex items-center relative px-8 pt-10 pb-6">
                    <button
                        onClick={handleBack}
                        className="absolute left-10 flex items-center justify-center w-10 h-10 min-w-10 min-h-10 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent"
                        style={{ border: '3px solid #1a1a1a' }}
                        aria-label="Go back"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" fill="#1a1a1a">
                            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                        </svg>
                    </button>
                    <h1 className="text-zinc-900 text-[28px] font-bold w-full text-center leading-tight">
                        Category
                    </h1>
                </div>

                <div className="px-12 py-6 flex flex-col gap-10 flex-1">
                    {/* Search Input */}
                    <div className="relative">
                        <div
                            className="flex items-center w-full h-[54px] px-6 bg-[#f7f7f7]"
                            style={{ borderRadius: '12px' }}
                        >
                            <Search size={22} className="text-zinc-400 mr-4" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Title"
                                className="w-full text-zinc-900 text-lg outline-none bg-transparent placeholder:text-zinc-400 font-medium"
                            />
                        </div>
                    </div>

                    {/* Dynamic List Content */}
                    <div className="animate-in fade-in duration-300">
                        <h2 className="text-zinc-900 text-[22px] font-bold mb-8 capitalize">
                            {view === 'global' ? 'Global Regions' :
                                view === 'african' ? 'African Regions' :
                                    view === 'west-african' ? 'West African Regions' :
                                        'Popular categories'}
                        </h2>

                        <div className="flex flex-col gap-2">
                            {view !== 'cuisines' ? (
                                /* Drill-down List (Global, African, West African) */
                                list.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => {
                                            if (item === 'African') setView('african');
                                            else if (item === 'West African') setView('west-african');
                                            else if (item === 'Nigerian') setView('cuisines');
                                            setSearchQuery("");
                                        }}
                                        className="flex items-center justify-between py-5 group cursor-pointer border-none bg-transparent w-full hover:px-2 rounded-xl transition-all"
                                    >
                                        <span className="text-zinc-800 text-[19px] font-medium group-hover:text-zinc-900 transition-colors">
                                            {item}
                                        </span>
                                        <ChevronRight size={26} className="text-zinc-900 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))
                            ) : (
                                /* Selection List (Cuisines) */
                                <div className="flex flex-col gap-6">
                                    {list.map((category, index) => (
                                        <label key={`${category}-${index}`} className="flex items-center gap-5 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(category)}
                                                    onChange={() => toggleCategory(category)}
                                                    className="appearance-none w-[26px] h-[26px] border-2 border-zinc-900 rounded-md checked:bg-[#fbbe15] checked:border-zinc-900 transition-all cursor-pointer"
                                                />
                                                {selected.includes(category) && (
                                                    <svg
                                                        className="absolute w-4 h-4 text-zinc-900 pointer-events-none"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-zinc-800 text-lg font-medium group-hover:text-zinc-900 transition-colors">
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className={`px-12 pt-6 pb-12 flex items-center ${view !== 'cuisines' ? 'justify-end' : 'justify-center'} gap-5 mt-auto`}>
                    <button
                        onClick={handleCancel}
                        className={`border border-zinc-900 rounded-[12px] text-lg font-bold text-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer bg-white h-[58px] ${view !== 'cuisines' ? 'w-[200px]' : 'flex-1 max-w-[200px]'}`}
                    >
                        Cancel
                    </button>
                    {view === 'cuisines' && (
                        <button
                            onClick={handleApply}
                            className="flex-1 max-w-[200px] h-[58px] bg-[#fbbe15] rounded-[12px] text-lg font-bold text-[#1a1a1a] shadow-sm transition-opacity hover:opacity-90 cursor-pointer border-none"
                        >
                            Apply
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
