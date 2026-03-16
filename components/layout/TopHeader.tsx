"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, Search, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface TopHeaderProps {
    onMobileMenuOpen?: () => void;
}

export function TopHeader({ onMobileMenuOpen }: TopHeaderProps) {
    const { logout } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const handleLogout = () => {
        logout();
        queryClient.clear(); // Clear all cached queries
        toast({
            title: "Signed Out",
            description: "You have been successfully signed out.",
            variant: "success",
        });
        router.push("/feeds");
    };

    const navItems = [
        { label: "Account", href: "/settings/profile", active: true },
        { label: "Password & Security", href: "/settings/security", active: false },
        { label: "Delete Account", href: "/settings?tab=delete", active: false },
        { label: "Logout", href: null, active: false, onClick: handleLogout },
    ];

    return (
        <div className="flex flex-col w-full border-b border-[#1F1F1F] lg:border-none">
            {/* Mobile Top Section: Hamburger, Back Arrow & Search */}
            <div className="lg:hidden w-full px-4 pt-4 pb-2 flex items-center gap-3">
                <button
                    onClick={onMobileMenuOpen}
                    className="p-2 -ml-2 text-white hover:bg-[#1A1A1A] rounded-md mr-1"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <Link
                    href="/dashboard"
                    className="w-[36px] h-[36px] shrink-0 flex items-center justify-center rounded-full bg-transparent hover:bg-[#252525] transition-colors text-white border-2 border-white"
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </Link>
                <div className="relative flex-1">
                    <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full h-[40px] bg-[#1A1A1A] text-white text-[15px] rounded-[10px] pl-[42px] pr-4 outline-none border-none placeholder:text-[#6B7280] focus:ring-1 focus:ring-[#F5B400] transition-all"
                    />
                </div>
            </div>

            {/* Desktop & Mobile Navigation Links */}
            <div className="w-full pl-4 pr-4 lg:pl-[56px] lg:pr-12 pt-2 lg:pt-[152px] pb-4 lg:pb-10 flex items-center gap-6 lg:gap-[56px] overflow-x-auto scrollbar-hide">
                {navItems.map((item) => (
                    item.href ? (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "text-[16px] font-semibold transition-colors whitespace-nowrap",
                                item.active ? "text-white" : "text-[#9CA3AF] hover:text-gray-200"
                            )}
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <button
                            key={item.label}
                            onClick={item.onClick}
                            className={cn(
                                "text-[16px] font-semibold transition-colors whitespace-nowrap bg-transparent border-none cursor-pointer p-0",
                                item.label === "Logout" ? "text-white hover:text-gray-200" : "text-[#9CA3AF] hover:text-gray-200"
                            )}
                        >
                            {item.label}
                        </button>
                    )
                ))}
            </div>
        </div>
    );
}
