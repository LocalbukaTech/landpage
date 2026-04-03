"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Moon } from "lucide-react";

type DayHour = {
    isOpen: boolean;
    from: string;
    to: string;
};

type BusinessHours = {
    [key: string]: DayHour;
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursdays", "Friday", "Saturday", "Sunday"];

const DEFAULT_HOURS: BusinessHours = {
    "Monday": { isOpen: true, from: "09:00 AM", to: "05:30 PM" },
    "Tuesday": { isOpen: true, from: "09:00 AM", to: "05:30 PM" },
    "Wednesday": { isOpen: true, from: "09:00 AM", to: "05:30 PM" },
    "Thursdays": { isOpen: true, from: "09:00 AM", to: "05:30 PM" },
    "Friday": { isOpen: true, from: "09:00 AM", to: "05:30 PM" },
    "Saturday": { isOpen: false, from: "09:00 AM", to: "05:30 PM" },
    "Sunday": { isOpen: false, from: "09:00 AM", to: "05:30 PM" },
};

export default function BusinessHoursPage() {
    const router = useRouter();
    const [hours, setHours] = useState<BusinessHours>(DEFAULT_HOURS);

    useEffect(() => {
        const saved = localStorage.getItem("restaurantHours");
        if (saved) {
            try {
                setHours(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved hours", e);
            }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem("restaurantHours", JSON.stringify(hours));
        
        // Create a summary for the main form
        const openDays = Object.entries(hours).filter(([_, val]) => val.isOpen);
        let summary = "Not set";
        if (openDays.length > 0) {
            if (openDays.length === 7) {
                summary = `Daily: ${openDays[0][1].from} - ${openDays[0][1].to}`;
            } else {
                summary = `${openDays.length} days open`;
            }
        } else {
            summary = "Always Closed";
        }
        
        localStorage.setItem("summaryHours", summary);
        router.push("/buka/list-resturant");
    };

    const handleReset = () => {
        setHours(DEFAULT_HOURS);
    };

    const toggleDay = (day: string) => {
        setHours(prev => ({
            ...prev,
            [day]: { ...prev[day], isOpen: !prev[day].isOpen }
        }));
    };

    const updateTime = (day: string, field: 'from' | 'to', value: string) => {
        setHours(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center pt-8 pb-12 font-[var(--font-nunito-sans)] px-4">
            
            {/* Breadcrumb outside the card */}
            <div className="w-full max-w-xl self-center px-4 mb-4" style={{ maxWidth: '640px' }}>
                <p className="text-zinc-400 text-lg font-medium">
                    Business Hours
                </p>
            </div>

            <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col" style={{ maxWidth: '640px', minHeight: '740px' }}>
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
                        Hours
                    </h1>
                </div>

                <div className="px-12 py-6 flex flex-col gap-8 flex-1">
                    {/* Description */}
                    <div>
                        <h2 className="text-zinc-900 text-[22px] font-bold mb-2">
                            Business Hours
                        </h2>
                        <p className="text-zinc-800 text-lg leading-snug font-medium opacity-80">
                            This shows the restaurant&apos;s operating hours and when it is open for transactions.
                        </p>
                    </div>

                    {/* Days List Table */}
                    <table className="w-full border-collapse">
                        <tbody className="flex flex-col gap-5">
                            {DAYS.map((day) => {
                                const config = hours[day];
                                return (
                                    <tr key={day} className="flex items-center justify-between w-full">
                                        {/* Day Column */}
                                        <td className="w-[180px] pr-4">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => toggleDay(day)}
                                                    className={`relative w-[44px] h-[22px] rounded-full transition-colors duration-200 cursor-pointer p-1 flex items-center ${config.isOpen ? 'bg-[#001F3F]' : 'bg-zinc-300'}`}
                                                >
                                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${config.isOpen ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                                <span className="text-lg font-bold text-zinc-900">{day}</span>
                                            </div>
                                        </td>

                                        {/* Time Columns */}
                                        {config.isOpen ? (
                                            <>
                                                <td className="flex-1 max-w-[155px]">
                                                    <div className="flex items-center px-4 py-2 bg-white border border-zinc-300 rounded-lg h-[52px]">
                                                        <span className="text-zinc-400 text-sm font-medium mr-2">From</span>
                                                        <input
                                                            type="text"
                                                            value={config.from}
                                                            onChange={(e) => updateTime(day, 'from', e.target.value)}
                                                            className="w-full bg-transparent text-sm font-bold text-zinc-900 outline-none text-right"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="w-3" /> {/* Spacer */}
                                                <td className="flex-1 max-w-[155px]">
                                                    <div className="flex items-center px-4 py-2 bg-white border border-zinc-300 rounded-lg h-[52px]">
                                                        <span className="text-zinc-400 text-sm font-medium mr-2">To</span>
                                                        <input
                                                            type="text"
                                                            value={config.to}
                                                            onChange={(e) => updateTime(day, 'to', e.target.value)}
                                                            className="w-full bg-transparent text-sm font-bold text-zinc-900 outline-none text-right"
                                                        />
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <td colSpan={3} className="flex-1">
                                                <div className="flex items-center gap-3 px-5 py-2 bg-[#f4f4f4] border border-zinc-100 rounded-lg w-full h-[52px] text-[#888] font-medium ml-auto">
                                                    <Moon size={18} className="opacity-50" />
                                                    <span>Closed</span>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer Buttons */}
                <div className="px-12 pt-6 pb-12 flex items-center justify-center gap-5 mt-auto">
                    <button
                        onClick={handleReset}
                        className="flex-1 max-w-[200px] h-[58px] border border-zinc-900 rounded-[12px] text-lg font-bold text-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer bg-white"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 max-w-[200px] h-[58px] bg-[#fbbe15] rounded-[12px] text-lg font-bold text-[#1a1a1a] shadow-sm transition-opacity hover:opacity-90 cursor-pointer border-none"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
