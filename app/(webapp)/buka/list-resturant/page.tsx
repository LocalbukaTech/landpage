"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ListResturant() {
    const router = useRouter();

    const [restaurantName, setRestaurantName] = useState("");
    const [address, setAddress] = useState("");
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
    const [summaryHours, setSummaryHours] = useState("Hours");

    useEffect(() => {
        const saved = localStorage.getItem("listRestaurantForm");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setRestaurantName(parsed.restaurantName || "");
                setAddress(parsed.address || "");
            } catch (e) {
                console.error("Failed to parse saved form", e);
            }
        }
        const savedCuisines = localStorage.getItem("selectedCuisines");
        if (savedCuisines) {
            try {
                setSelectedCuisines(JSON.parse(savedCuisines));
            } catch (e) {
                console.error("Failed to parse selected cuisines", e);
            }
        }
        const savedSummary = localStorage.getItem("summaryHours");
        if (savedSummary) {
            setSummaryHours(savedSummary);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "listRestaurantForm",
            JSON.stringify({ restaurantName, address })
        );
    }, [restaurantName, address]);

    const handleSubmit = () => {
        router.push("/buka/list-resturant/note");
    };

    const handleCancel = () => {
        localStorage.removeItem("listRestaurantForm");
        localStorage.removeItem("selectedCuisines");
        localStorage.removeItem("restaurantHours");
        localStorage.removeItem("summaryHours");
        router.push("/buka");
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center pt-8 pb-12 font-[var(--font-nunito-sans)] px-4">
            
            {/* Breadcrumb outside the card */}
            <div className="w-full max-w-xl self-center px-4 mb-4" style={{ maxWidth: '640px' }}>
                <p className="text-zinc-400 text-lg font-medium">
                    List a Restaurant/Add more details
                </p>
            </div>

            <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col" style={{ maxWidth: '640px' }}>
                {/* Header */}
                <div className="flex items-center relative px-8 pt-10 pb-6">
                    <button
                        onClick={() => router.back()}
                        className="absolute left-10 flex items-center justify-center w-10 h-10 min-w-10 min-h-10 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent"
                        style={{ border: '3px solid #1a1a1a' }}
                        aria-label="Go back"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" fill="#1a1a1a">
                            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                        </svg>
                    </button>
                    <h1 className="text-zinc-900 text-[28px] font-bold w-full text-center leading-tight">
                        List a Restaurant
                    </h1>
                </div>

                {/* Main Content Body */}
                <div className="px-12 py-6 flex flex-col gap-10 flex-1">
                    {/* Section Title */}
                    <div>
                        <h2 className="text-zinc-900 text-[22px] font-bold mb-3">
                            Place details
                        </h2>
                        <p className="text-zinc-800 text-lg leading-snug font-medium">
                            Provide some information about this place. If this place is added to Maps, it will appear publicly.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="flex flex-col gap-10">
                        {/* Restaurant Name */}
                        <div 
                            className="flex flex-col justify-center w-full h-[64px] px-6 py-2 bg-white transition-all"
                            style={{ border: '1.5px solid #1a1a1a', borderRadius: '12px' }}
                        >
                            <label className="text-zinc-400 text-sm font-medium leading-tight mb-0.5">
                                Restaurant Name
                            </label>
                            <input
                                type="text"
                                value={restaurantName}
                                onChange={(e) => setRestaurantName(e.target.value)}
                                placeholder="Text|"
                                className="w-full text-zinc-900 text-lg font-bold outline-none bg-transparent placeholder:text-zinc-400 leading-tight"
                            />
                        </div>

                        {/* Address */}
                        <div 
                            className="flex flex-col justify-center w-full h-[64px] px-6 py-2 bg-white transition-all"
                            style={{ border: '1.5px solid #1a1a1a', borderRadius: '12px' }}
                        >
                            <label className="text-zinc-400 text-sm font-medium leading-tight mb-0.5">
                                Address
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Text|"
                                className="w-full text-zinc-900 text-lg font-bold outline-none bg-transparent placeholder:text-zinc-400 leading-tight"
                            />
                        </div>

                        {/* Cuisines */}
                        <button
                            onClick={() => router.push("/buka/list-resturant/category")}
                            className="w-full h-[64px] px-6 flex items-center justify-between cursor-pointer bg-white hover:bg-zinc-50 transition-all group"
                            style={{ border: '1.5px solid #1a1a1a', borderRadius: '12px' }}
                        >
                            <span className="text-lg text-zinc-900 font-bold">
                                {selectedCuisines.length > 0
                                    ? `${selectedCuisines.join(", ")}`
                                    : "Cuisine"}
                            </span>
                            <ChevronRight size={24} className="text-zinc-900 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Hours */}
                        <button
                            onClick={() => router.push("/buka/list-resturant/hours")}
                            className="w-full h-[64px] px-6 flex items-center justify-between cursor-pointer bg-white hover:bg-zinc-50 transition-all group"
                            style={{ border: '1.5px solid #1a1a1a', borderRadius: '12px' }}
                        >
                            <span className="text-lg text-zinc-900 font-bold">
                                {summaryHours}
                            </span>
                            <ChevronRight size={24} className="text-zinc-900 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-12 pt-10 pb-12 flex items-center justify-center gap-5 mt-auto">
                    <button
                        onClick={handleCancel}
                        className="flex-1 max-w-[200px] h-[58px] border border-zinc-900 rounded-[12px] text-lg font-bold text-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer bg-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 max-w-[200px] h-[58px] bg-[#fbbe15] rounded-[12px] text-lg font-bold text-[#1a1a1a] shadow-sm transition-opacity hover:opacity-90 cursor-pointer border-none"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
