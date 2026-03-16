"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard,
    Users,
    Store,
    ShieldCheck,
    Megaphone,
    BarChart3,
    KeyRound,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/secure-admin" },
    { icon: Users, label: "User Management", href: "/secure-admin/user-management" },
    { icon: Store, label: "Buka Management", href: "/secure-admin/buka-management" },
    { icon: ShieldCheck, label: "Content Moderation", href: "/secure-admin/content-moderation" },
    { icon: Megaphone, label: "Ad Placements", href: "/secure-admin/ad-placements" },
    { icon: BarChart3, label: "Analytics & Reporting", href: "/secure-admin/analytics" },
    { icon: KeyRound, label: "Roles", href: "/secure-admin/roles" },
];

interface AdminSidebarProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export function AdminSidebar({ isCollapsed, onToggleCollapse }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col justify-between min-h-screen border-r border-zinc-200 bg-white transition-[width] duration-300 sticky top-0 h-screen",
                isCollapsed ? "w-[72px] px-3 py-6 items-center" : "w-[240px] p-6"
            )}
        >
            <div className={cn("flex flex-col gap-6", isCollapsed ? "w-full items-center" : "")}>
                {/* Logo + Collapse Toggle */}
                <div className={cn(
                    "flex items-center",
                    isCollapsed ? "justify-center" : "justify-between"
                )}>
                    <Link
                        href="/secure-admin"
                        className={cn(
                            "flex items-center gap-2",
                            isCollapsed ? "justify-center" : ""
                        )}
                    >
                        {!isCollapsed && (
                            <span
                                className="text-xl text-zinc-900 font-normal"
                                style={{ fontFamily: 'var(--font-hakuna), sans-serif' }}
                            >
                                LocalBuka
                            </span>
                        )}
                        <Image
                            src="/images/localBuka_logo.png"
                            alt="LocalBuka"
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full"
                            priority
                        />
                    </Link>

                    <button
                        onClick={onToggleCollapse}
                        className={cn(
                            "w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors rounded",
                            isCollapsed ? "mt-4" : ""
                        )}
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className={cn("flex flex-col gap-1", isCollapsed ? "w-full" : "")}>
                    {adminNavItems.map((item) => {
                        const isActive = item.href === "/secure-admin"
                            ? pathname === "/secure-admin"
                            : pathname?.startsWith(item.href);

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors",
                                    isActive
                                        ? "bg-[#fbbe15]/10 text-[#b8860b]"
                                        : "text-zinc-600 hover:bg-zinc-100",
                                    isCollapsed ? "justify-center px-2" : ""
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                                {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
