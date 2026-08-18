'use client';

import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  MessageCircle,
  HelpCircle,
  FileText,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface HelpSupportProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

const FAQS = [
  {
    question: 'What is LocalBuka?',
    answer:
      'LocalBuka is a vibrant food discovery and community platform connecting foodies with the best authentic local restaurants, bukas, and street food spots across Nigeria and beyond.',
  },
  {
    question: 'How do I list my restaurant on LocalBuka?',
    answer:
      'You can register your restaurant directly by navigating to the "List Restaurant" section on our website or mobile app. Once submitted, our team will review and verify your listing within 24–48 hours.',
  },
  {
    question: 'How does Refer & Earn work?',
    answer:
      'Share your unique referral link with friends. When they sign up and start discovering bukas, you automatically earn reward points that you can convert directly into airtime, mobile data, and discounts.',
  },
  {
    question: 'How do I upload food reels and photos?',
    answer:
      'Click the "+ Upload" or "Studio" button on the navigation bar. You can upload high-definition food reels (MP4/WebM) or photos, tag the specific buka, add captions, and share your experience with the community.',
  },
  {
    question: 'How do I report inappropriate content or fake listings?',
    answer:
      'You can click the menu icon (...) on any post or restaurant page and select "Report". Alternatively, email support@localbuka.com with the link and details for our safety team to review immediately.',
  },
];

export function HelpSupport({
  activeSubTab = 'help',
  onSubTabChange,
}: HelpSupportProps) {
  const [currentTab, setCurrentTab] = useState(activeSubTab);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const subTabs = [
    {id: 'help', label: 'Contact Support'},
    {id: 'faqs', label: 'Frequently Asked Questions'},
    {id: 'terms', label: 'Terms & Policies'},
  ];

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    onSubTabChange?.(tabId);
  };

  const toggleFaq = (idx: number) => {
    setExpandedFaq((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className='flex flex-col gap-0'>
      {/* Sub-tabs strip */}
      <div className='flex gap-4 border-b border-white/10 overflow-x-auto scrollbar-hide'>
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`pb-3 text-sm font-medium transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap shrink-0 ${
              currentTab === tab.id
                ? 'text-white border-b-2 border-[#FBBE15]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            style={
              currentTab === tab.id ? {borderBottom: '2px solid #FBBE15'} : {}
            }>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className='mt-8'>
        {/* ── Contact Support ── */}
        {currentTab === 'help' && (
          <div className='flex flex-col gap-6'>
            {/* Quick Banner */}
            <div className='p-5 rounded-2xl bg-gradient-to-r from-zinc-900 to-[#1e1b13] border border-white/10 flex items-start gap-4'>
              <div className='w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-2 shrink-0'>
                <Image
                  src='/images/localBuka_logo.png'
                  alt='LocalBuka Logo'
                  width={36}
                  height={36}
                  className='object-contain rounded-full'
                />
              </div>
              <div className='flex-1'>
                <h3 className='text-base font-semibold text-white mb-1'>
                  We&apos;re here to help!
                </h3>
                <p className='text-xs text-zinc-400 leading-relaxed'>
                  Have questions, found a bug, or need assistance with your
                  account or restaurant? Reach out to our dedicated support team
                  anytime.
                </p>
              </div>
            </div>

            {/* Support Action Cards */}
            <div className='grid sm:grid-cols-2 gap-4'>
              {/* Email Support Card */}
              <div className='p-5 rounded-xl bg-zinc-900/60 border border-white/10 flex flex-col justify-between gap-4'>
                <div className='flex items-start gap-3'>
                  <div className='p-2.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0'>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold text-white mb-1'>
                      Email Support
                    </h4>
                    <p className='text-xs text-zinc-400'>
                      Send us an email and we&apos;ll respond within 24 hours.
                    </p>
                    <span className='text-xs text-zinc-300 font-mono mt-2 block'>
                      support@localbuka.com
                    </span>
                  </div>
                </div>
                <a
                  href='mailto:support@localbuka.com'
                  className='inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FBBE15] text-[#1a1a1a] text-xs font-bold rounded-lg hover:bg-[#e5ab13] transition-colors no-underline'>
                  <Mail size={15} />
                  <span>Send Email</span>
                </a>
              </div>

              {/* Chat Support Card */}
              <div className='p-5 rounded-xl bg-zinc-900/60 border border-white/10 flex flex-col justify-between gap-4'>
                <div className='flex items-start gap-3'>
                  <div className='p-2.5 rounded-lg bg-green-500/10 text-green-400 shrink-0'>
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold text-white mb-1'>
                      Chat with Us
                    </h4>
                    <p className='text-xs text-zinc-400'>
                      Chat directly with our customer support representatives.
                    </p>
                    <span className='text-xs text-emerald-400 mt-2 block font-medium'>
                      ● Available Mon - Sat (8am - 8pm)
                    </span>
                  </div>
                </div>
                <a
                  href='mailto:support@localbuka.com?subject=Support%20Inquiry'
                  className='inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/20 transition-colors no-underline'>
                  <MessageCircle size={15} />
                  <span>Start Chat</span>
                </a>
              </div>
            </div>

            {/* Help Topics Box */}
            <div className='mt-2 p-5 rounded-xl bg-zinc-900/40 border border-white/10'>
              <h4 className='text-sm font-semibold text-white mb-3'>
                Popular Topics
              </h4>
              <div className='grid sm:grid-cols-2 gap-2 text-xs text-zinc-300'>
                <button
                  onClick={() => handleTabChange('faqs')}
                  className='flex items-center gap-2 p-2.5 rounded-lg hover:bg-white/5 text-left transition-colors cursor-pointer text-zinc-300 hover:text-[#FBBE15]'>
                  <HelpCircle size={15} className='text-zinc-500 shrink-0' />
                  <span>How to redeem reward points</span>
                </button>
                <button
                  onClick={() => handleTabChange('faqs')}
                  className='flex items-center gap-2 p-2.5 rounded-lg hover:bg-white/5 text-left transition-colors cursor-pointer text-zinc-300 hover:text-[#FBBE15]'>
                  <HelpCircle size={15} className='text-zinc-500 shrink-0' />
                  <span>Listing your local restaurant</span>
                </button>
                <button
                  onClick={() => handleTabChange('faqs')}
                  className='flex items-center gap-2 p-2.5 rounded-lg hover:bg-white/5 text-left transition-colors cursor-pointer text-zinc-300 hover:text-[#FBBE15]'>
                  <HelpCircle size={15} className='text-zinc-500 shrink-0' />
                  <span>Food Reel upload guidelines</span>
                </button>
                <button
                  onClick={() => handleTabChange('faqs')}
                  className='flex items-center gap-2 p-2.5 rounded-lg hover:bg-white/5 text-left transition-colors cursor-pointer text-zinc-300 hover:text-[#FBBE15]'>
                  <HelpCircle size={15} className='text-zinc-500 shrink-0' />
                  <span>Account security & verification</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── FAQs Tab ── */}
        {currentTab === 'faqs' && (
          <div className='flex flex-col gap-3'>
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className='rounded-xl bg-zinc-900/60 border border-white/10 overflow-hidden transition-all'>
                  <button
                    onClick={() => toggleFaq(idx)}
                    className='w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer bg-transparent border-none text-white hover:text-[#FBBE15] transition-colors'>
                    <span className='text-sm font-semibold'>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`text-zinc-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#FBBE15]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className='px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in'>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}

            <div className='p-4 mt-4 rounded-xl bg-zinc-900/40 border border-white/5 text-center'>
              <p className='text-xs text-zinc-400 mb-2'>
                Didn&apos;t find the answer you were looking for?
              </p>
              <button
                onClick={() => handleTabChange('help')}
                className='text-xs text-[#FBBE15] hover:underline font-semibold cursor-pointer bg-transparent border-none'>
                Contact our support team directly →
              </button>
            </div>
          </div>
        )}

        {/* ── Terms & Policies Tab ── */}
        {currentTab === 'terms' && (
          <div className='flex flex-col gap-4'>
            <div className='grid sm:grid-cols-2 gap-4'>
              {/* Privacy Policy */}
              <Link
                href='/privacy'
                className='p-5 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-[#FBBE15]/50 transition-all flex flex-col justify-between gap-4 group no-underline'>
                <div className='flex items-start gap-3'>
                  <div className='p-2.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0'>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold text-white group-hover:text-[#FBBE15] transition-colors mb-1'>
                      Privacy Policy
                    </h4>
                    <p className='text-xs text-zinc-400'>
                      Understand how we collect, protect, and handle your data.
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-1.5 text-xs text-[#FBBE15] font-semibold'>
                  <span>Read Policy</span>
                  <ExternalLink size={13} />
                </div>
              </Link>

              {/* Music & Content Policy */}
              <Link
                href='/privacy#music-usage-policy'
                className='p-5 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-[#FBBE15]/50 transition-all flex flex-col justify-between gap-4 group no-underline'>
                <div className='flex items-start gap-3'>
                  <div className='p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0'>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold text-white group-hover:text-[#FBBE15] transition-colors mb-1'>
                      Community & Music Policy
                    </h4>
                    <p className='text-xs text-zinc-400'>
                      Guidelines for video uploads, music rights, and community standards.
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-1.5 text-xs text-[#FBBE15] font-semibold'>
                  <span>Read Guidelines</span>
                  <ExternalLink size={13} />
                </div>
              </Link>
            </div>

            <div className='p-4 rounded-xl bg-zinc-900/40 border border-white/5 text-center text-xs text-zinc-500 mt-2'>
              Last updated: 2026 • LocalBuka Technologies Inc.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
