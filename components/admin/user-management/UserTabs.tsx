"use client";

import { cn } from "@/lib/utils";
import type { UserTab } from "@/types/admin";

interface UserTabsProps {
    activeTab: UserTab;
    onTabChange: (tab: UserTab) => void;
}

const tabs: { key: UserTab; label: string }[] = [
    { key: "real", label: "Real Accounts" },
    { key: "fake", label: "Fake/Spam Accounts" },
];

export function UserTabs({ activeTab, onTabChange }: UserTabsProps) {
    return (
        <div className="flex items-center gap-6 border-b border-zinc-200">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onTabChange(tab.key)}
                    className={cn(
                        "pb-3 text-sm font-medium transition-colors relative",
                        activeTab === tab.key
                            ? "text-zinc-900"
                            : "text-zinc-400 hover:text-zinc-600"
                    )}
                >
                    {tab.label}
                    {activeTab === tab.key && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900 rounded-full" />
                    )}
                </button>
            ))}
        </div>
    );
}
