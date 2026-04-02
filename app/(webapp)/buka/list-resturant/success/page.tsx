"use client";

import { useRouter } from "next/navigation";

export default function SuccessPage() {
    const router = useRouter();

    return (
        <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center justify-center font-[var(--font-nunito-sans)] px-4">
            <div className="w-full max-w-xl bg-white rounded-[32px] shadow-sm border border-zinc-200 overflow-hidden flex flex-col p-12 items-center text-center" style={{ maxWidth: '640px' }}>
                
                {/* Success Animation (Concentric Rings) */}
                <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full bg-[#E7F6E7] opacity-60" />
                    {/* Middle ring */}
                    <div className="absolute inset-8 rounded-full bg-[#D1EDD1] opacity-70" />
                    {/* Inner ring - matches the green circles in the image */}
                    <div className="absolute inset-16 rounded-full bg-[#BCE4BC] flex items-center justify-center shadow-inner">
                        {/* Party Popper Emoji - Consistent with project's success icons */}
                        <span className="text-[72px] transform -rotate-12 animate-in zoom-in duration-500">🎉</span>
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-zinc-900 text-[28px] font-bold mb-4 leading-tight">
                    Restaurant submitted successfully!
                </h1>
                <p className="text-zinc-600 text-[19px] font-medium leading-[1.6] max-w-[480px] mb-12">
                    Our team is currently reviewing your listing. You&apos;ll be notified once it has been approved and published.
                </p>

                {/* Back Home Button */}
                <button
                    onClick={() => router.push("/buka")}
                    className="w-full h-[64px] bg-[#fbbe15] rounded-[16px] text-xl font-bold text-[#1a1a1a] shadow-sm transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer border-none"
                >
                    Back Home
                </button>
            </div>
        </div>
    );
}
