'use client';

import { useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  Gift, 
  LayoutDashboard, 
  Users, 
  Receipt, 
  ShieldAlert, 
  Trophy, 
  Plus, 
  Tag,
  Loader2 
} from 'lucide-react';
import { AdminOverviewTab } from '@/components/admin/rewards/AdminOverviewTab';
import { AdminReferralsTab } from '@/components/admin/rewards/AdminReferralsTab';
import { AdminTransactionsTab } from '@/components/admin/rewards/AdminTransactionsTab';
import { AdminFlaggedTab } from '@/components/admin/rewards/AdminFlaggedTab';
import { AdminTopReferrersTab } from '@/components/admin/rewards/AdminTopReferrersTab';
import { AdminVanityCodesTab } from '@/components/admin/rewards/AdminVanityCodesTab';
import { AdminAdjustPointsModal } from '@/components/admin/rewards/AdminAdjustPointsModal';
import { AdminApproveVanityModal } from '@/components/admin/rewards/AdminApproveVanityModal';
import { AdminReferralDetailModal } from '@/components/admin/rewards/AdminReferralDetailModal';

type AdminTab = 'overview' | 'referrals' | 'vanity-codes' | 'ledger' | 'flagged' | 'promoters';

const VALID_TABS: AdminTab[] = ['overview', 'referrals', 'vanity-codes', 'ledger', 'flagged', 'promoters'];
const STORAGE_KEY = 'admin_rewards_active_tab';

function AdminRewardsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine active tab from URL query param or state/localStorage
  const tabParam = searchParams.get('tab') as AdminTab | null;
  const validTabParam = tabParam && VALID_TABS.includes(tabParam) ? tabParam : null;

  const [activeTabState, setActiveTabState] = useState<AdminTab>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as AdminTab | null;
      if (stored && VALID_TABS.includes(stored)) {
        return stored;
      }
    }
    return 'overview';
  });

  const activeTab: AdminTab = validTabParam || activeTabState;

  const handleTabChange = (tab: AdminTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, tab);
      const params = new URLSearchParams(window.location.search);
      params.set('tab', tab);
      window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
    }
  };

  // Modal States
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isVanityModalOpen, setIsVanityModalOpen] = useState(false);
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);

  const [modalTargetUser, setModalTargetUser] = useState<{ id: string; name: string }>({
    id: '',
    name: '',
  });

  const handleOpenAdjustModal = (userId: string = '', userName: string = '') => {
    setModalTargetUser({ id: userId, name: userName });
    setIsAdjustModalOpen(true);
  };

  const handleOpenVanityModal = (userId: string = '', userName: string = '') => {
    setModalTargetUser({ id: userId, name: userName });
    setIsVanityModalOpen(true);
  };

  const navTabs = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'vanity-codes' as AdminTab, label: 'Vanity Codes', icon: Tag },
    { id: 'referrals' as AdminTab, label: 'All Referrals', icon: Users },
    { id: 'ledger' as AdminTab, label: 'Platform Ledger', icon: Receipt },
    { id: 'flagged' as AdminTab, label: 'Fraud & Flagged', icon: ShieldAlert },
    { id: 'promoters' as AdminTab, label: 'Top Promoters', icon: Trophy },
  ];

  return (
    <div className='flex flex-col gap-8 pb-16 max-w-7xl mx-auto'>
      {/* Top Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center'>
              <Gift size={22} />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white m-0'>
                Rewards &amp; Referral Management
              </h1>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 m-0'>
                Monitor referrals, audit point ledger transactions, review fraud checks, and configure creator vanity codes.
              </p>
            </div>
          </div>
        </div>

        {/* Global Admin Action Buttons */}
        <div className='flex items-center gap-3 shrink-0'>
          <button
            onClick={() => handleOpenVanityModal()}
            className='px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 transition-colors cursor-pointer'>
            <Tag size={14} className='text-amber-500' />
            Grant Vanity Code
          </button>

          <button
            onClick={() => handleOpenAdjustModal()}
            className='px-4 py-2.5 rounded-xl bg-[#fbbe15] hover:bg-[#e5ac10] text-[#1a1a1a] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border-none'>
            <Plus size={14} />
            Adjust Points
          </button>
        </div>
      </div>

      {/* Clean Tab Navigation */}
      <div className='flex items-center gap-1 border-b border-gray-200 dark:border-gray-800 overflow-x-auto scrollbar-hide'>
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[#fbbe15] text-[#b8860b] dark:text-[#fbbe15] bg-transparent'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700 bg-transparent'
              }`}>
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels: persistent rendered panels for 100% smooth, non-blinking tab switches */}
      <div className='w-full'>
        <div className={activeTab === 'overview' ? 'block' : 'hidden'}>
          <AdminOverviewTab
            onOpenAdjustModal={handleOpenAdjustModal}
            onOpenVanityModal={handleOpenVanityModal}
            onViewAllReferrals={() => handleTabChange('referrals')}
            onViewFlagged={() => handleTabChange('flagged')}
            onViewLedger={() => handleTabChange('ledger')}
          />
        </div>

        <div className={activeTab === 'vanity-codes' ? 'block' : 'hidden'}>
          <AdminVanityCodesTab
            onOpenAdjustModal={handleOpenAdjustModal}
            onOpenVanityModal={handleOpenVanityModal}
          />
        </div>

        <div className={activeTab === 'referrals' ? 'block' : 'hidden'}>
          <AdminReferralsTab
            onViewDetail={(id) => setSelectedReferralId(id)}
          />
        </div>

        <div className={activeTab === 'ledger' ? 'block' : 'hidden'}>
          <AdminTransactionsTab />
        </div>

        <div className={activeTab === 'flagged' ? 'block' : 'hidden'}>
          <AdminFlaggedTab
            onViewDetail={(id) => setSelectedReferralId(id)}
            onOpenAdjustModal={handleOpenAdjustModal}
          />
        </div>

        <div className={activeTab === 'promoters' ? 'block' : 'hidden'}>
          <AdminTopReferrersTab
            onOpenAdjustModal={handleOpenAdjustModal}
            onOpenVanityModal={handleOpenVanityModal}
          />
        </div>
      </div>

      {/* Modals */}
      <AdminAdjustPointsModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        defaultUserId={modalTargetUser.id}
        defaultUserName={modalTargetUser.name}
      />

      <AdminApproveVanityModal
        isOpen={isVanityModalOpen}
        onClose={() => setIsVanityModalOpen(false)}
        defaultUserId={modalTargetUser.id}
        defaultUserName={modalTargetUser.name}
      />

      <AdminReferralDetailModal
        referralId={selectedReferralId}
        onClose={() => setSelectedReferralId(null)}
      />
    </div>
  );
}

export default function AdminRewardsPage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center py-24'>
          <Loader2 className='w-8 h-8 animate-spin text-[#fbbe15]' />
        </div>
      }>
      <AdminRewardsContent />
    </Suspense>
  );
}
