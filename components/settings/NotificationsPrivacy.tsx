"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface NotificationsPrivacyProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

type ToggleSetting = {
  key: string;
  label: string;
  description: string;
  defaultOn: boolean;
};

const pushNotificationSettings: ToggleSetting[] = [
  {
    key: "order_updates",
    label: "Order Updates",
    description: "Get notified when your order status changes",
    defaultOn: true,
  },
  {
    key: "new_nearby_buka",
    label: "New Nearby Buka",
    description: "Alerts when new local restaurants are available.",
    defaultOn: true,
  },
  {
    key: "special_offers",
    label: "Special Offers / Discounts",
    description: "Receive promotions and deals.",
    defaultOn: false,
  },
  {
    key: "personalized_meal",
    label: "Personalized Meal",
    description: "Suggestions based on your taste and preferences.",
    defaultOn: false,
  },
];

const dataSharingSettings: ToggleSetting[] = [
  {
    key: "share_location",
    label: "Share Location",
    description: "Allow the app to use location for nearby bukas",
    defaultOn: true,
  },
  {
    key: "share_activity",
    label: "Share Activity",
    description: "Let others see your activity and reviews.",
    defaultOn: false,
  },
  {
    key: "search_history",
    label: "Search History",
    description: "See your search story for better recommendations.",
    defaultOn: true,
  },
];

const subTabs = [
  { id: "push", label: "Push Notifications" },
  { id: "privacy", label: "Privacy Settings" },
  { id: "data", label: "Data Sharing / Permissions" },
];
const validTabIds = subTabs.map((t) => t.id);

const PUSH_STORAGE_KEY = "lb_push_settings";
const DATA_STORAGE_KEY = "lb_data_permissions";

const getDefaults = (settings: ToggleSetting[]) =>
  Object.fromEntries(settings.map((s) => [s.key, s.defaultOn])) as Record<
    string,
    boolean
  >;

// Helper to safely load settings from localStorage during state init
const loadStoredSettings = (
  storageKey: string,
  defaults: Record<string, boolean>,
): Record<string, boolean> => {
  // Guard for SSR — window is not available on the server
  if (typeof window === "undefined") return defaults;
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return defaults;
    return { ...defaults, ...JSON.parse(saved) };
  } catch {
    return defaults;
  }
};

export function NotificationsPrivacy({
  activeSubTab = "push",
  onSubTabChange,
}: NotificationsPrivacyProps) {
  const { toast } = useToast();

  const [internalTab, setInternalTab] = useState(activeSubTab);
  const currentTab =
    onSubTabChange && validTabIds.includes(activeSubTab)
      ? activeSubTab
      : internalTab;

  // Lazy initializers read from localStorage during the first render on the client.
  // On the server, they fall back to defaults (no hydration mismatch).
  const [pushToggles, setPushToggles] = useState(() =>
    loadStoredSettings(PUSH_STORAGE_KEY, getDefaults(pushNotificationSettings)),
  );
  const [dataToggles, setDataToggles] = useState(() =>
    loadStoredSettings(DATA_STORAGE_KEY, getDefaults(dataSharingSettings)),
  );

  const handleTabChange = (tabId: string) => {
    setInternalTab(tabId);
    onSubTabChange?.(tabId);
  };

  const saveSettings = (
    storageKey: string,
    values: Record<string, boolean>,
    description: string,
  ) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {
      // Ignore storage error
    }
    toast({ title: "Settings Saved", description });
  };

  const renderToggleSwitch = (
    checked: boolean,
    onToggle: () => void,
    ariaLabel: string,
  ) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onToggle}
      className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer border-none shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#FBBE15] ${
        checked ? "bg-[#001F3F]" : "bg-zinc-600"
      }`}
    >
      <span
        className={`inline-block w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
          checked ? "translate-x-5.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );

  const renderSettingRow = (
    setting: ToggleSetting,
    values: Record<string, boolean>,
    setValues: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  ) => (
    <div key={setting.key} className="flex items-center justify-between">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-white">
          {setting.label}
        </span>
        <span className="text-xs text-zinc-400">{setting.description}</span>
      </div>
      {renderToggleSwitch(
        !!values[setting.key],
        () =>
          setValues((prev) => ({ ...prev, [setting.key]: !prev[setting.key] })),
        setting.label,
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-0">
      {/* Sub-tabs */}
      <div className="flex gap-4 border-b border-white/10 overflow-x-auto scrollbar-hide">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`pb-3 text-sm font-medium transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap shrink-0 ${
              currentTab === tab.id
                ? "text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            style={
              currentTab === tab.id ? { borderBottom: "2px solid #FBBE15" } : {}
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
            {pushNotificationSettings.map((s) =>
              renderSettingRow(s, pushToggles, setPushToggles),
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() =>
                  saveSettings(
                    PUSH_STORAGE_KEY,
                    pushToggles,
                    "Notification preferences updated successfully.",
                  )
                }
                className="px-16 py-3 bg-[#FBBE15] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#e5ab13] transition-colors cursor-pointer border-none"
              >
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
          <div className="flex flex-col gap-6">
            {dataSharingSettings.map((s) =>
              renderSettingRow(s, dataToggles, setDataToggles),
            )}

            {/* Reset row */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-white">
                  Clear Preferences
                </span>
                <span className="text-xs text-zinc-400">
                  Reset all privacy settings
                </span>
              </div>
              <button
                onClick={() => setDataToggles(getDefaults(dataSharingSettings))}
                className="px-4 py-2 bg-[#FBBE15] text-[#1a1a1a] font-semibold rounded-lg hover:bg-[#e5ab13] transition-colors cursor-pointer border border-[#FBBE15] text-sm"
              >
                Reset
              </button>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() =>
                  saveSettings(
                    DATA_STORAGE_KEY,
                    dataToggles,
                    "Data sharing and permissions updated successfully.",
                  )
                }
                className="px-16 py-3 bg-[#FBBE15] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#e5ab13] transition-colors cursor-pointer border-none"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
