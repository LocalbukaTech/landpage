"use client";

import {
    ArrowLeft,
    Search,
    User,
    Bell,
    Gift,
    X
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SettingsSidebarProps {
    onClose?: () => void;
}

export function SettingsSidebar({ onClose }: SettingsSidebarProps) {
    return (
        <div className="w-full h-full flex flex-col bg-[#0F0F0F] lg:bg-transparent">
            {/* Top Container */}
            <div className="flex flex-col">
                {/* Mobile Close Button (Standalone) */}
                <div className="lg:hidden px-4 pt-6 pb-2">
                    <button
                        onClick={onClose}
                        className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-transparent hover:bg-[#252525] transition-colors text-white"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Desktop Header Elements (Hidden on Mobile) */}
                <div className="hidden lg:flex px-7 pt-[60px] pb-8 items-center gap-3">
                    {/* Back Arrow / Mobile Close */}
                    <button
                        onClick={onClose}
                        className="md:hidden w-[36px] h-[36px] flex-shrink-0 flex items-center justify-center rounded-full bg-transparent hover:bg-[#252525] transition-colors text-white mr-2"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Back to Dashboard Arrow */}
                    <Link
                        href="/dashboard"
                        className="w-[36px] h-[36px] flex-shrink-0 flex items-center justify-center rounded-full bg-transparent hover:bg-[#252525] transition-colors text-white border-[2px] border-white"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </Link>

                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full h-[40px] bg-[#1A1A1A] text-white text-[15px] rounded-[10px] pl-[42px] pr-4 outline-none border-none placeholder:text-[#6B7280] focus:ring-1 focus:ring-[#F5B400] transition-all"
                        />
                    </div>
                </div>

                {/* Navigation Section */}
                <div className="pl-[76px] pr-8 flex flex-col gap-[12px] mt-2">
                    <Link
                        href="/settings/profile"
                        onClick={onClose}
                        className="flex items-center gap-[16px] px-0 py-3 text-[#F5B400] font-medium transition-colors text-[16px]"
                    >
                        <User className="w-[22px] h-[22px]" />
                        <span>Account Information</span>
                    </Link>
                    <Link
                        href="/settings/notifications"
                        onClick={onClose}
                        className="flex items-center gap-[16px] px-0 py-3 text-[#9CA3AF] hover:text-white transition-colors text-[16px]"
                    >
                        <Bell className="w-[22px] h-[22px]" />
                        <span>Notifications & Privacy</span>
                    </Link>
                    <Link
                        href="/settings/rewards"
                        onClick={onClose}
                        className="flex items-center gap-[16px] px-0 py-3 text-[#9CA3AF] hover:text-white transition-colors text-[16px]"
                    >
                        <Gift className="w-[22px] h-[22px]" />
                        <span>Rewards & Support</span>
                    </Link>
                </div>
            </div>

            {/* Bottom Footer Section */}
            <div className="mt-auto px-8 pb-12 pt-20 flex flex-col gap-1">
                <Link href="#" className="text-[13px] text-white hover:text-gray-200 font-medium">Company</Link>
                <Link href="#" className="text-[13px] text-white hover:text-gray-200 font-medium">Program</Link>
                <Link href="#" className="text-[13px] text-white hover:text-gray-200 font-medium">Terms & Policies</Link>
                <div className="mt-1 text-[11px] text-white">
                    © {new Date().getFullYear()} Localbuka
                </div>
            </div>
        </div>
    );
}
