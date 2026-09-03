'use client';

import {useState} from 'react';
import {useToast} from '@/hooks/use-toast';
import {Download, RotateCcw} from 'lucide-react';

interface NotificationsPrivacyProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

// 1. Push Notifications Config
const pushNotificationSettings = [
  {
    key: 'orderUpdates',
    label: 'Order Updates',
    description: 'Get notified when your order status changes',
    defaultOn: true,
  },
  {
    key: 'newNearbyBuka',
    label: 'New Nearby Buka',
    description: 'Alerts when new local restaurants are available.',
    defaultOn: true,
  },
  {
    key: 'specialOffers',
    label: 'Special Offers / Discounts',
    description: 'Receive promotions and deals.',
    defaultOn: false,
  },
  {
    key: 'personalizedMeal',
    label: 'Personalized Meal',
    description: 'Suggestions based on your taste and preferences.',
    defaultOn: false,
  },
];

// 2. Privacy Settings Config (Matching UI Mockup)
const privacySettings = [
  {
    key: 'shareLocation',
    label: 'Share Location',
    description: 'Allow the app to use your location for nearby bukas',
    defaultOn: true,
  },
  {
    key: 'shareActivity',
    label: 'Share Activity',
    description: 'Let others see your activity and reviews.',
    defaultOn: false,
  },
  {
    key: 'searchHistory',
    label: 'Search History',
    description: 'Save your search history for better recommendations.',
    defaultOn: true,
  },
];

// 3. Data Sharing & Permissions Config
const devicePermissionsSettings = [
  {
    key: 'cameraAccess',
    label: 'Camera Access',
    description:
      'Allow LocalBuka to access your camera to capture food reels and review photos.',
    defaultOn: true,
  },
  {
    key: 'mediaLibrary',
    label: 'Photo & Video Library',
    description:
      'Allow access to your device gallery to upload photos and video content.',
    defaultOn: true,
  },
  {
    key: 'microphoneAccess',
    label: 'Microphone Access',
    description:
      'Allow microphone access for recording audio in food reels and reviews.',
    defaultOn: true,
  },
  {
    key: 'preciseGeolocation',
    label: 'Precise Geolocation',
    description:
      'Share high-accuracy GPS location for buka discovery and delivery estimations.',
    defaultOn: true,
  },
];

const analyticsSharingSettings = [
  {
    key: 'usageData',
    label: 'Diagnostic & Usage Data',
    description:
      'Share anonymous crash reports and performance statistics to help improve LocalBuka.',
    defaultOn: true,
  },
  {
    key: 'partnerOffers',
    label: 'Personalized Partner Offers',
    description:
      'Allow non-identifying dining preferences to be shared with buka partners for exclusive deals.',
    defaultOn: false,
  },
];

const validTabIds = ['push', 'privacy', 'data'];

export function NotificationsPrivacy({
  activeSubTab,
  onSubTabChange,
}: NotificationsPrivacyProps) {
  const {toast} = useToast();
  const [internalTab, setInternalTab] = useState(
    activeSubTab && validTabIds.includes(activeSubTab) ? activeSubTab : 'push',
  );
  const currentTab =
    onSubTabChange && activeSubTab && validTabIds.includes(activeSubTab)
      ? activeSubTab
      : internalTab;
  const [isExporting, setIsExporting] = useState(false);

  // Push Notifications State
  const [pushToggles, setPushToggles] = useState<Record<string, boolean>>(() => {
    const defaults = Object.fromEntries(
      pushNotificationSettings.map((s) => [s.key, s.defaultOn]),
    );
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lb_push_settings');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback to defaults
      }
    }
    return defaults;
  });

  // Privacy Settings State
  const [privacyToggles, setPrivacyToggles] = useState<Record<string, boolean>>(
    () => {
      const defaults = Object.fromEntries(
        privacySettings.map((s) => [s.key, s.defaultOn]),
      );
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('lb_privacy_settings');
          if (saved) return JSON.parse(saved);
        } catch {
          // fallback to defaults
        }
      }
      return defaults;
    },
  );

  // Data Sharing / Permissions State
  const [dataToggles, setDataToggles] = useState<Record<string, boolean>>(() => {
    const defaults = Object.fromEntries(
      [...devicePermissionsSettings, ...analyticsSharingSettings].map((s) => [
        s.key,
        s.defaultOn,
      ]),
    );
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lb_data_permissions');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback to defaults
      }
    }
    return defaults;
  });

  const subTabs = [
    {id: 'push', label: 'Push Notifications'},
    {id: 'privacy', label: 'Privacy Settings'},
    {id: 'data', label: 'Data Sharing / Permissions'},
  ];

  const handleTabChange = (tabId: string) => {
    setInternalTab(tabId);
    onSubTabChange?.(tabId);
  };

  // Toggle handlers
  const handlePushToggle = (key: string) => {
    setPushToggles((prev) => ({...prev, [key]: !prev[key]}));
  };

  const handlePrivacyToggle = (key: string) => {
    setPrivacyToggles((prev) => ({...prev, [key]: !prev[key]}));
  };

  const handleDataToggle = (key: string) => {
    setDataToggles((prev) => ({...prev, [key]: !prev[key]}));
  };

  // Reset Handlers
  const handleResetPrivacy = () => {
    const defaults = Object.fromEntries(
      privacySettings.map((s) => [s.key, s.defaultOn]),
    );
    setPrivacyToggles(defaults);
    try {
      localStorage.setItem('lb_privacy_settings', JSON.stringify(defaults));
    } catch {
      // Ignore storage error
    }
    toast({
      title: 'Preferences Reset',
      description: 'Privacy settings have been restored to default values.',
      variant: 'default',
    });
  };

  const handleResetDataPermissions = () => {
    const defaults = Object.fromEntries(
      [...devicePermissionsSettings, ...analyticsSharingSettings].map((s) => [
        s.key,
        s.defaultOn,
      ]),
    );
    setDataToggles(defaults);
    try {
      localStorage.setItem('lb_data_permissions', JSON.stringify(defaults));
    } catch {
      // Ignore storage error
    }
    toast({
      title: 'Permissions Reset',
      description:
        'Data sharing and permissions have been restored to default values.',
      variant: 'default',
    });
  };

  // Save Handlers
  const handleSavePush = () => {
    try {
      localStorage.setItem('lb_push_settings', JSON.stringify(pushToggles));
    } catch {
      // Ignore storage error
    }
    toast({
      title: 'Settings Saved',
      description: 'Push notification preferences updated successfully.',
      variant: 'default',
    });
  };

  const handleSavePrivacy = () => {
    try {
      localStorage.setItem(
        'lb_privacy_settings',
        JSON.stringify(privacyToggles),
      );
    } catch {
      // Ignore storage error
    }
    toast({
      title: 'Settings Saved',
      description: 'Privacy settings updated successfully.',
      variant: 'default',
    });
  };

  const handleSaveData = () => {
    try {
      localStorage.setItem('lb_data_permissions', JSON.stringify(dataToggles));
    } catch {
      // Ignore storage error
    }
    toast({
      title: 'Settings Saved',
      description: 'Data sharing and permissions updated successfully.',
      variant: 'default',
    });
  };

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: 'Export Request Submitted',
        description:
          'Your account activity archive is being prepared. You will receive an email once ready.',
        variant: 'default',
      });
    }, 900);
  };

  // Reusable Toggle Switch Component
  const renderToggleSwitch = (
    checked: boolean,
    onToggle: () => void,
    ariaLabel: string,
  ) => (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onToggle}
      className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer border-none shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#FBBE15] ${
        checked ? 'bg-[#001F3F]' : 'bg-zinc-600'
      }`}>
      <span
        className={`inline-block w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
          checked ? 'translate-x-5.5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  return (
    <div className='flex flex-col gap-0'>
      {/* Sub-tabs Header */}
      <div className='flex gap-4 md:gap-6 border-b border-white/10 overflow-x-auto scrollbar-hide'>
        {subTabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`pb-3 text-xs md:text-sm font-medium transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap shrink-0 ${
                isActive
                  ? 'text-white border-b-2 border-[#FBBE15]'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={isActive ? {borderBottom: '2px solid #FBBE15'} : {}}>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className='mt-8'>
        {/* TAB 1: PUSH NOTIFICATIONS */}
        {currentTab === 'push' && (
          <div className='flex flex-col gap-6'>
            {pushNotificationSettings.map((setting) => (
              <div
                key={setting.key}
                className='flex items-center justify-between gap-4'>
                <div className='flex flex-col gap-0.5 min-w-0'>
                  <span className='text-sm font-semibold text-white'>
                    {setting.label}
                  </span>
                  <span className='text-xs text-zinc-400 leading-relaxed'>
                    {setting.description}
                  </span>
                </div>
                {renderToggleSwitch(
                  !!pushToggles[setting.key],
                  () => handlePushToggle(setting.key),
                  setting.label,
                )}
              </div>
            ))}

            {/* Save Button */}
            <div className='flex justify-end mt-4'>
              <button
                type='button'
                onClick={handleSavePush}
                className='w-full sm:w-auto px-16 py-3 bg-[#FBBE15] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#e5ab13] active:scale-[0.99] transition-all cursor-pointer border-none shadow-sm text-sm text-center'>
                Save
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PRIVACY SETTINGS (Matches UI Mockup) */}
        {currentTab === 'privacy' && (
          <div className='flex flex-col gap-6'>
            {privacySettings.map((setting) => (
              <div
                key={setting.key}
                className='flex items-center justify-between gap-4'>
                <div className='flex flex-col gap-0.5 min-w-0'>
                  <span className='text-sm font-semibold text-white'>
                    {setting.label}
                  </span>
                  <span className='text-xs text-zinc-400 leading-relaxed'>
                    {setting.description}
                  </span>
                </div>
                {renderToggleSwitch(
                  !!privacyToggles[setting.key],
                  () => handlePrivacyToggle(setting.key),
                  setting.label,
                )}
              </div>
            ))}

            {/* Clear Preferences (Reset) */}
            <div className='flex items-center justify-between gap-4 pt-1'>
              <div className='flex flex-col gap-0.5 min-w-0'>
                <span className='text-sm font-semibold text-white'>
                  Clear Preferences
                </span>
                <span className='text-xs text-zinc-400'>
                  Reset all privacy settings
                </span>
              </div>
              <button
                type='button'
                onClick={handleResetPrivacy}
                className='px-3.5 py-1 bg-[#FBBE15] text-[#1a1a1a] text-xs font-semibold rounded-md hover:bg-[#e5ab13] active:scale-95 transition-all cursor-pointer border-none shrink-0 shadow-sm'>
                Reset
              </button>
            </div>

            {/* Save Button */}
            <div className='flex justify-end mt-6'>
              <button
                type='button'
                onClick={handleSavePrivacy}
                className='w-full sm:w-auto px-16 py-3 bg-[#FBBE15] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#e5ab13] active:scale-[0.99] transition-all cursor-pointer border-none shadow-sm text-sm text-center'>
                Save
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: DATA SHARING / PERMISSIONS */}
        {currentTab === 'data' && (
          <div className='flex flex-col gap-7'>
            {/* Group 1: Device Permissions */}
            <div className='flex flex-col gap-5'>
              <div className='border-b border-white/5 pb-2'>
                <h3 className='text-xs font-semibold uppercase tracking-wider text-zinc-400'>
                  Device & Hardware Permissions
                </h3>
              </div>
              <div className='flex flex-col gap-5'>
                {devicePermissionsSettings.map((setting) => (
                  <div
                    key={setting.key}
                    className='flex items-center justify-between gap-4'>
                    <div className='flex flex-col gap-0.5 min-w-0'>
                      <span className='text-sm font-semibold text-white'>
                        {setting.label}
                      </span>
                      <span className='text-xs text-zinc-400 leading-relaxed'>
                        {setting.description}
                      </span>
                    </div>
                    {renderToggleSwitch(
                      !!dataToggles[setting.key],
                      () => handleDataToggle(setting.key),
                      setting.label,
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Group 2: Data Sharing & Analytics */}
            <div className='flex flex-col gap-5'>
              <div className='border-b border-white/5 pb-2'>
                <h3 className='text-xs font-semibold uppercase tracking-wider text-zinc-400'>
                  Data Sharing & Insights
                </h3>
              </div>
              <div className='flex flex-col gap-5'>
                {analyticsSharingSettings.map((setting) => (
                  <div
                    key={setting.key}
                    className='flex items-center justify-between gap-4'>
                    <div className='flex flex-col gap-0.5 min-w-0'>
                      <span className='text-sm font-semibold text-white'>
                        {setting.label}
                      </span>
                      <span className='text-xs text-zinc-400 leading-relaxed'>
                        {setting.description}
                      </span>
                    </div>
                    {renderToggleSwitch(
                      !!dataToggles[setting.key],
                      () => handleDataToggle(setting.key),
                      setting.label,
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Group 3: Data Management & Export */}
            <div className='flex flex-col gap-5'>
              <div className='border-b border-white/5 pb-2'>
                <h3 className='text-xs font-semibold uppercase tracking-wider text-zinc-400'>
                  Data Management
                </h3>
              </div>
              <div className='flex flex-col gap-5'>
                {/* Download My Data */}
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex flex-col gap-0.5 min-w-0'>
                    <span className='text-sm font-semibold text-white'>
                      Download My Data
                    </span>
                    <span className='text-xs text-zinc-400 leading-relaxed'>
                      Request an archive containing your profile, reviews, and
                      activity history.
                    </span>
                  </div>
                  <button
                    type='button'
                    disabled={isExporting}
                    onClick={handleExportData}
                    className='flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2a2a2a] text-[#FBBE15] hover:bg-[#333333] border border-[#FBBE15]/40 text-xs font-semibold rounded-md transition-all cursor-pointer shrink-0 disabled:opacity-50'>
                    <Download size={13} />
                    <span>{isExporting ? 'Preparing...' : 'Export'}</span>
                  </button>
                </div>

                {/* Reset Data Permissions */}
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex flex-col gap-0.5 min-w-0'>
                    <span className='text-sm font-semibold text-white'>
                      Clear Permissions
                    </span>
                    <span className='text-xs text-zinc-400'>
                      Reset all data sharing permissions to defaults
                    </span>
                  </div>
                  <button
                    type='button'
                    onClick={handleResetDataPermissions}
                    className='flex items-center gap-1 px-3.5 py-1 bg-[#FBBE15] text-[#1a1a1a] text-xs font-semibold rounded-md hover:bg-[#e5ab13] active:scale-95 transition-all cursor-pointer border-none shrink-0 shadow-sm'>
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className='flex justify-end mt-4'>
              <button
                type='button'
                onClick={handleSaveData}
                className='w-full sm:w-auto px-16 py-3 bg-[#FBBE15] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#e5ab13] active:scale-[0.99] transition-all cursor-pointer border-none shadow-sm text-sm text-center'>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
