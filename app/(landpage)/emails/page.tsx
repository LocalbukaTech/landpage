'use client';

import React, { useState, useMemo } from 'react';
import {
  renderWelcomeEmail,
  renderReengagementEmail,
  renderReferralRewardsEmail,
  renderWelcomeVisualEmail,
  EmailRenderResult,
  EmailDynamicData,
} from '@/lib/email';
import {
  FiMail,
  FiSmartphone,
  FiMonitor,
  FiCopy,
  FiCheck,
  FiDownload,
  FiGift,
  FiRefreshCw,
  FiCompass,
} from 'react-icons/fi';

type TemplateKey = 'welcome' | 'reengagement' | 'referral-referrer' | 'referral-referee' | 'welcome-visual';

export default function EmailTemplatesGalleryPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('welcome');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);

  // Dynamic state
  const [name, setName] = useState('Wilson');
  const [pointsEarned, setPointsEarned] = useState(50);
  const [currentBalance, setCurrentBalance] = useState(100);
  const [referralCode, setReferralCode] = useState('WILSON-BUKA');

  const currentEmail: EmailRenderResult = useMemo(() => {
    const data: EmailDynamicData = {
      name,
      pointsEarned,
      currentBalance,
      referralCode,
      appUrl: typeof window !== 'undefined' ? window.location.origin : 'https://localbuka.com',
    };

    switch (selectedTemplate) {
      case 'welcome':
        return renderWelcomeEmail(data);
      case 'reengagement':
        return renderReengagementEmail(data);
      case 'referral-referrer':
        return renderReferralRewardsEmail({ ...data, variant: 'referrer' });
      case 'referral-referee':
        return renderReferralRewardsEmail({ ...data, variant: 'referee', pointsEarned: 25, currentBalance: 25 });
      case 'welcome-visual':
        return renderWelcomeVisualEmail({ ...data, name: name || 'Bolaji' });
      default:
        return renderWelcomeEmail(data);
    }
  }, [selectedTemplate, name, pointsEarned, currentBalance, referralCode]);

  const handleCopyHtml = async () => {
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(currentEmail.html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([currentEmail.html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentEmail.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const templatesList = [
    { id: 'welcome', label: 'Welcome Email', tag: 'Template 01', icon: FiMail },
    { id: 'reengagement', label: 'Re-engagement', tag: 'Template 02', icon: FiCompass },
    { id: 'referral-referrer', label: 'Referral Rewards (Referrer)', tag: '+50 pts', icon: FiGift },
    { id: 'referral-referee', label: 'Referral Rewards (Referee)', tag: '+25 pts', icon: FiGift },
    { id: 'welcome-visual', label: 'Visual Welcome', tag: 'Template 07', icon: FiRefreshCw },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#0B1120]/90 backdrop-blur px-6 py-4 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#FBBE15] flex items-center justify-center text-[#0A182F] font-black text-xl shadow-lg shadow-[#FBBE15]/20">
            LB
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              LocalBuka Email Templates
              <span className="text-xs bg-[#FBBE15]/20 text-[#FBBE15] px-2 py-0.5 rounded-full font-medium">
                Responsive & Bulletproof
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive preview, testing & production-ready HTML export
            </p>
          </div>
        </div>

        {/* Viewport & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Responsive Toggle */}
          <div className="flex bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewportMode === 'desktop'
                  ? 'bg-[#FBBE15] text-[#0A182F] font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Desktop 600px Preview"
            >
              <FiMonitor className="w-3.5 h-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewportMode === 'mobile'
                  ? 'bg-[#FBBE15] text-[#0A182F] font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Mobile 375px Preview"
            >
              <FiSmartphone className="w-3.5 h-3.5" />
              Mobile
            </button>
          </div>

          {/* Copy HTML Button */}
          <button
            onClick={handleCopyHtml}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-700 transition"
          >
            {copied ? (
              <>
                <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied HTML!</span>
              </>
            ) : (
              <>
                <FiCopy className="w-3.5 h-3.5" />
                Copy HTML
              </>
            )}
          </button>

          {/* Download HTML Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 bg-[#FBBE15] hover:bg-[#F2B005] text-[#0A182F] px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-md shadow-[#FBBE15]/20"
          >
            <FiDownload className="w-3.5 h-3.5" />
            Download .html
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Sidebar: Template Selection & Controls */}
        <aside className="w-full lg:w-80 border-r border-slate-800 bg-[#0B1120] p-5 overflow-y-auto shrink-0 flex flex-col gap-6">
          {/* Template Selector */}
          <div>
            <label className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3 block">
              Email Templates
            </label>
            <div className="space-y-1.5">
              {templatesList.map((tpl) => {
                const isSelected = selectedTemplate === tpl.id;
                const Icon = tpl.icon;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id as TemplateKey)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1E293B] border-[#FBBE15] shadow-sm'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#FBBE15] text-[#0A182F]' : 'bg-slate-800 text-slate-300'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-medium ${isSelected ? 'text-white font-bold' : 'text-slate-300'}`}>
                        {tpl.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-[#FBBE15]">
                      {tpl.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Data Customizer */}
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              Dynamic Fields
            </h3>
            
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Recipient Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wilson, Bolaji"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FBBE15]"
              />
            </div>

            {(selectedTemplate === 'referral-referrer' || selectedTemplate === 'referral-referee') && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Points Earned</label>
                    <input
                      type="number"
                      value={pointsEarned}
                      onChange={(e) => setPointsEarned(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FBBE15]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Balance</label>
                    <input
                      type="number"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FBBE15]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Referral Code</label>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FBBE15]"
                  />
                </div>
              </>
            )}
          </div>

          {/* Email Metadata Card */}
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 text-xs space-y-2.5">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Subject Line</span>
              <p className="text-slate-200 font-medium text-xs mt-0.5">{currentEmail.subject}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Preheader Text</span>
              <p className="text-slate-400 text-xs mt-0.5">{currentEmail.preheader}</p>
            </div>
          </div>
        </aside>

        {/* Right Preview Area */}
        <main className="flex-1 bg-[#090D16] p-6 flex flex-col items-center justify-start overflow-y-auto">
          <div
            className="transition-all duration-300 w-full flex flex-col items-center"
            style={{
              maxWidth: viewportMode === 'mobile' ? '390px' : '650px',
            }}
          >
            {/* Viewport Frame Header */}
            <div className="w-full bg-slate-800/90 rounded-t-xl px-4 py-2 border border-b-0 border-slate-700 text-xs text-slate-300 flex items-center justify-between">
              <span className="font-semibold text-slate-200">
                {currentEmail.title}
              </span>
              <span className="text-[11px] text-slate-400">
                {viewportMode === 'mobile' ? 'Mobile Width (375px)' : 'Standard Email Width (600px)'}
              </span>
            </div>

            {/* Email Iframe Box */}
            <div className="w-full bg-[#EDECE8] rounded-b-xl border border-slate-700 overflow-hidden shadow-2xl">
              <iframe
                title="Email Preview"
                srcDoc={currentEmail.html}
                className="w-full border-0"
                style={{
                  height: '840px',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
