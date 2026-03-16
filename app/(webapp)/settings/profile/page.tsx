"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsSidebar } from "@/components/layout/SettingsSidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { ProfileDetails } from "@/components/profile/ProfileDetails";

export default function SettingsProfilePage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#0F0F0F] text-white font-sans relative">
            {/* Sidebar Wrapper - Handles Mobile Overlay & Desktop Fixed */}
            <div className={cn(
                "fixed inset-0 z-50 bg-[#0F0F0F] transition-transform duration-300 lg:relative lg:translate-x-0 lg:bg-transparent lg:w-[320px] lg:block lg:border-r border-[#1F1F1F] lg:border-none",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SettingsSidebar onClose={() => setIsMobileMenuOpen(false)} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header Navigation */}
                <TopHeader onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />

                {/* Profile Details Content */}
                <div className="flex-1 overflow-auto">
                    <ProfileDetails />
                </div>
            </div>
        </div>
    );
}
