"use client";

import { useRouter } from "next/navigation";

export default function NotePage() {
    const router = useRouter();

    const handleContinue = () => {
        // Final submission logic
        const saved = localStorage.getItem("listRestaurantForm");
        const savedCuisines = localStorage.getItem("selectedCuisines");
        
        if (saved) {
            try {
                const formData = {
                    ...JSON.parse(saved),
                    cuisines: savedCuisines ? JSON.parse(savedCuisines) : [],
                };
                console.log("Final submission:", formData);
                
                localStorage.removeItem("listRestaurantForm");
                localStorage.removeItem("selectedCuisines");
                localStorage.removeItem("restaurantHours");
                localStorage.removeItem("summaryHours");
                router.push("/buka/list-resturant/success");
            } catch (e) {
                console.error("Failed to parse saved data", e);
                router.push("/buka/list-resturant");
            }
        } else {
            router.push("/buka/list-resturant");
        }
    };

    const handleCancel = () => {
        localStorage.removeItem("listRestaurantForm");
        localStorage.removeItem("selectedCuisines");
        router.push("/buka");
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center pt-8 pb-12 font-[var(--font-nunito-sans)] px-4">
            
            {/* Breadcrumb outside the card */}
            <div className="w-full max-w-xl self-center px-4 mb-4" style={{ maxWidth: '640px' }}>
                <p className="text-zinc-400 text-lg font-medium">
                    List a Restaurant/Add more details/Note
                </p>
            </div>

            <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col min-h-[640px]" style={{ maxWidth: '640px' }}>
                
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
                        Note
                    </h1>
                </div>

                {/* Content Area */}
                <div className="px-12 py-6 flex flex-col gap-8 flex-1">
                    <h2 className="text-zinc-900 text-[22px] font-bold">
                        How your posts appear
                    </h2>
                    
                    <div className="flex flex-col gap-5 text-[#333] text-lg font-medium leading-[1.5]">
                        <div className="flex gap-4">
                            <span className="min-w-[20px]">1.</span>
                            <p>Posts may appear publicly with your profile name, picture, or link to your profile.</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="min-w-[20px]">2.</span>
                            <p>Posts must follow Localbuka&apos;s policies.</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-4">
                                <span className="min-w-[20px]">3.</span>
                                <p>How your posts are used</p>
                            </div>
                            <div className="flex items-start gap-4 pl-9">
                                <span className="text-[12px] mt-2">●</span>
                                <p>Posts may appear on and be used across Localbuka&apos;s services and 3rd party sites and apps that use Localbuka&apos;s services.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="min-w-[20px]">4.</span>
                            <p>You can delete your post anytime.</p>
                        </div>
                    </div>

                    <button className="text-zinc-900 text-lg font-bold underline text-left mt-6 hover:opacity-80 transition-opacity">
                        See content policy
                    </button>
                </div>

                {/* Footer Buttons */}
                <div className="px-12 pt-10 pb-12 flex items-center justify-center gap-5 mt-auto">
                    <button
                        onClick={handleCancel}
                        className="flex-1 max-w-[200px] h-[58px] border border-zinc-900 rounded-[12px] text-lg font-bold text-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer bg-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleContinue}
                        className="flex-1 max-w-[200px] h-[58px] bg-[#fbbe15] rounded-[12px] text-lg font-bold text-[#1a1a1a] shadow-sm transition-opacity hover:opacity-90 cursor-pointer border-none"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
