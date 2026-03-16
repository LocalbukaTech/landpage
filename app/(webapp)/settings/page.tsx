"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { AccountInformation } from "@/components/settings/AccountInformation";
import { NotificationsPrivacy } from "@/components/settings/NotificationsPrivacy";
import { RewardsSupport } from "@/components/settings/RewardsSupport";

export default function SettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("account");
  const [activeSubTab, setActiveSubTab] = useState("account");

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Top Bar */}
      <div className="flex items-center gap-4 px-6 py-4">
        <button
          onClick={() => router.push("/profile")}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer bg-transparent"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            placeholder="Search"
            className="w-full py-2.5 pl-10 pr-4 bg-[#2a2a2a] border-0 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex px-6 gap-8 min-h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        <div className="w-56 shrink-0 py-4">
          <SettingsSidebar
            activeSection={activeSection}
            onSectionChange={(section) => {
              setActiveSection(section);
              if (section === "account") {
                setActiveSubTab("account");
              }
            }}
          />
        </div>

        {/* Right Content */}
        <div className="flex-1 py-4 max-w-3xl">
          {activeSection === "account" && (
            <AccountInformation
              activeSubTab={activeSubTab}
              onSubTabChange={setActiveSubTab}
            />
          )}
          {activeSection === "notifications" && <NotificationsPrivacy />}
          {activeSection === "rewards" && <RewardsSupport />}
        </div>
      </div>
    </div>
  );
}
