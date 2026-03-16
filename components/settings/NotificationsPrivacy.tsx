"use client";

import { useState } from "react";

interface NotificationsPrivacyProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

const pushNotificationSettings = [
  {
    label: "Order Updates",
    description: "Get notified when your order status changes",
    defaultOn: true,
  },
  {
    label: "New Nearby Buka",
    description: "Alerts when new local restaurants are available.",
    defaultOn: true,
  },
  {
    label: "Special Offers / Discounts",
    description: "Receive promotions and deals.",
    defaultOn: false,
  },
  {
    label: "Personalized Meal",
    description: "Suggestions based on your taste and preferences.",
    defaultOn: false,
  },
];

export function NotificationsPrivacy({
  activeSubTab = "push",
  onSubTabChange,
}: NotificationsPrivacyProps) {
  const [currentTab, setCurrentTab] = useState(activeSubTab);
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      pushNotificationSettings.map((s) => [s.label, s.defaultOn])
    )
  );

  const subTabs = [
    { id: "push", label: "Push Notifications" },
    { id: "privacy", label: "Privacy Settings" },
    { id: "data", label: "Data Sharing / Permissions" },
  ];

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    onSubTabChange?.(tabId);
  };

  const handleToggle = (label: string) => {
    setToggles((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Sub-tabs */}
      <div className="flex gap-6 border-b border-white/10">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`pb-3 text-sm font-medium transition-colors cursor-pointer bg-transparent border-none ${
              currentTab === tab.id
                ? "text-white border-b-2 border-[#FBBE15]"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            style={
              currentTab === tab.id
                ? { borderBottom: "2px solid #FBBE15" }
                : {}
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-8">
        {currentTab === "push" && (
          <div className="flex flex-col gap-6">
            {pushNotificationSettings.map((setting) => (
              <div
                key={setting.label}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-white">
                    {setting.label}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {setting.description}
                  </span>
                </div>
                <button
                  onClick={() => handleToggle(setting.label)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer border-none ${
                    toggles[setting.label] ? "bg-[#001F3F]" : "bg-zinc-600"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      toggles[setting.label]
                        ? "translate-x-5.5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}

            {/* Save Button */}
            <div className="flex justify-end mt-4">
              <button className="px-16 py-3 bg-[#FBBE15] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#e5ab13] transition-colors cursor-pointer border-none">
                Save
              </button>
            </div>
          </div>
        )}

        {currentTab === "privacy" && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-2xl font-bold text-white mb-2">Coming Soon</p>
              <p className="text-sm text-zinc-400">
                Privacy settings will be available in a future update.
              </p>
            </div>
          </div>
        )}

        {currentTab === "data" && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-2xl font-bold text-white mb-2">Coming Soon</p>
              <p className="text-sm text-zinc-400">
                Data sharing and permissions settings will be available in a
                future update.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
