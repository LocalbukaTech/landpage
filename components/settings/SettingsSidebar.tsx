'use client';

import {User, Lock, RotateCcw, LogOut} from 'lucide-react';
import Link from 'next/link';
import {useTranslation} from '@/context/LanguageContext';

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function SettingsSidebar({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  const {t} = useTranslation();

  const sidebarItems = [
    {id: 'account', label: t('settings.account', 'Account Information'), icon: User},
    {id: 'notifications', label: t('settings.notifications', 'Notifications & Privacy'), icon: Lock},
    {id: 'support', label: t('settings.rewardsSupport', 'Rewards & Support'), icon: RotateCcw},
  ];

  const footerLinks = [
    {label: t('nav.company', 'Company'), href: '/company'},
    {label: t('nav.program', 'Program'), href: '/rewards'},
    {label: t('nav.termsAndPolicies', 'Terms & Policies'), href: '/privacy'},
  ];

  return (
    <div className='flex flex-col justify-between h-full'>
      <nav className='flex flex-col gap-1'>
        {sidebarItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 text-left ${
                isActive ? 'text-[#FBBE15]' : 'text-white hover:text-zinc-300'
              }`}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => onSectionChange('logout')}
        className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 text-left mt-auto ${
          activeSection === 'logout' ? 'text-[#FBBE15]' : 'text-white hover:text-zinc-300'
        }`}>
        <LogOut size={18} />
        <span>{t('settings.logout', 'Logout')}</span>
      </button>

      <footer className='flex flex-col gap-1.5 pt-4 text-xs text-zinc-400'>
        {footerLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className='hover:text-zinc-300 transition-colors font-medium'>
            {link.label}
          </Link>
        ))}
        <span className='text-[11px] text-zinc-600 mt-1 font-normal'>&copy; 2025 Localbuka</span>
      </footer>
    </div>
  );
}
