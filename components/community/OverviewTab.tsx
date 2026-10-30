"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface OverviewTabProps {
  defaultLoading?: boolean;
  onNavigateToContent?: () => void;
}

export function OverviewTab({
  defaultLoading = false,
  onNavigateToContent,
}: OverviewTabProps) {
  const [isLoading, setIsLoading] = useState(defaultLoading);

  return (
    <div className="w-full text-white space-y-6 pt-1">
      {/* Dev / Reviewer State Switcher */}
      <div className="flex justify-end mb-2" style={{ maxWidth: '1012px' }}>
        <button
          type="button"
          onClick={() => setIsLoading(!isLoading)}
          className="text-xs text-white/50 hover:text-[#FBBE15] transition-colors underline cursor-pointer"
        >
          {isLoading ? "Switch to filled state" : "Switch to loading state"}
        </button>
      </div>

      {isLoading ? (
        /* ================= FIGMA LOADING STATE ================= */
        <div className="space-y-10">
          {/* Top 3 Skeleton Boxes Row (1012px total, gap 23px, each 322x160px, r: 25px) */}
          <div
            className="flex items-center"
            style={{
              width: '100%',
              maxWidth: '1012px',
              height: '160px',
              display: 'flex',
              gap: '23px',
            }}
          >
            {[1, 2, 3].map((box) => (
              <div
                key={box}
                style={{
                  width: '322px',
                  height: '160px',
                  borderRadius: '25px',
                  backgroundColor: '#1E1E22',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                }}
                className="animate-pulse shadow-lg"
              />
            ))}
          </div>

          {/* Performance Section Skeleton */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Performance
            </h2>

            {/* Performance Main Box (911x440px, r: 18px, border 1px) */}
            <div
              style={{
                width: '100%',
                maxWidth: '911px',
                height: '440px',
                borderRadius: '18px',
                backgroundColor: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '31px 38px 24px 38px',
                boxSizing: 'border-box',
              }}
              className="shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Header Placeholder */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-4 rounded-full bg-white/10 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-white/10 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 opacity-30">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>

              {/* Chart Center Area with Vector-24 SVG & Subtle Grid Lines */}
              <div className="relative w-full flex-1 flex flex-col justify-center my-2">
                <div className="relative w-full flex items-center justify-center z-10">
                  <svg
                    width="100%"
                    height="239"
                    viewBox="0 0 697 239"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full max-w-[697px] h-[239px] overflow-visible"
                  >
                    <path
                      d="M0 181.59C74.6319 179.293 111.948 165.515 186.58 151.736C261.212 137.958 298.528 160.922 373.16 112.697C447.792 64.4728 485.108 96.6226 559.739 23.1374C609.494 -25.0872 641.834 9.35897 696.565 59.88V239H0V181.59Z"
                      fill="url(#paint0_linear_overview_loading)"
                    />
                    <path
                      d="M0 181.59C74.6319 179.293 111.948 165.515 186.58 151.736C261.212 137.958 298.528 160.922 373.16 112.697C447.792 64.4728 485.108 96.6226 559.739 23.1374C609.494 -25.0872 641.834 9.35897 696.565 59.88"
                      stroke="#383844"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_overview_loading"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="239"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#2E2E38" stopOpacity="0.55" />
                        <stop offset="0.7" stopColor="#1B1B20" stopOpacity="0.05" />
                        <stop offset="1" stopColor="#161618" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Bottom X-Axis Labels Skeleton */}
              <div className="flex items-center justify-between w-full pt-1 px-4">
                {[1, 2, 3, 4, 5, 6, 7].map((tab) => (
                  <div
                    key={tab}
                    style={{
                      width: '48px',
                      height: '14px',
                      borderRadius: '100px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    }}
                    className="animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= LOADED / FILLED FIGMA STATE ================= */
        <div className="space-y-10">
          {/* Top 3 Stat Cards: width 1012px, gap 23px, each 322x160px, r: 25px */}
          <div
            className="flex items-center flex-wrap"
            style={{
              width: '100%',
              maxWidth: '1012px',
              gap: '23px',
            }}
          >
            {/* 1. Active Members Card */}
            <div
              style={{
                width: '322px',
                height: '160px',
                borderRadius: '25px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: '#161618',
                padding: '22px 24px 20px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
              }}
              className="shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <path d="M19.35 18.3023C19.4338 18.4137 19.485 18.5463 19.4976 18.6852C19.5103 18.8241 19.484 18.9637 19.4216 19.0885C19.3593 19.2132 19.2634 19.3181 19.1448 19.3914C19.0262 19.4646 18.8894 19.5034 18.75 19.5033H0.75C0.610716 19.5033 0.474184 19.4645 0.355702 19.3912C0.23722 19.318 0.14147 19.2132 0.0791799 19.0887C0.0168902 18.9641 -0.0094776 18.8246 0.00303088 18.6859C0.0155394 18.5472 0.06643 18.4147 0.15 18.3033C0.814111 17.4129 1.69971 16.7118 2.71875 16.2698C2.16017 15.76 1.76878 15.0932 1.59595 14.357C1.42313 13.6207 1.47695 12.8494 1.75034 12.1443C2.02374 11.4392 2.50394 10.8333 3.12791 10.406C3.75188 9.97866 4.49046 9.75 5.24672 9.75C6.00297 9.75 6.74156 9.97866 7.36553 10.406C7.9895 10.8333 8.4697 11.4392 8.7431 12.1443C9.01649 12.8494 9.07031 13.6207 8.89749 14.357C8.72466 15.0932 8.33327 15.76 7.77469 16.2698C8.50989 16.5876 9.178 17.0422 9.74344 17.6095C10.3089 17.0422 10.977 16.5876 11.7122 16.2698C11.1536 15.76 10.7622 15.0932 10.5894 14.357C10.4166 13.6207 10.4704 12.8494 10.7438 12.1443C11.0172 11.4392 11.4974 10.8333 12.1213 10.406C12.7453 9.97866 13.4839 9.75 14.2402 9.75C14.9964 9.75 15.735 9.97866 16.359 10.406C16.9829 10.8333 17.4631 11.4392 17.7365 12.1443C18.0099 12.8494 18.0637 13.6207 17.8909 14.357C17.7181 15.0932 17.3267 15.76 16.7681 16.2698C17.7919 16.7095 18.6822 17.4104 19.35 18.3023ZM0.3 9.60325C0.378794 9.66235 0.468455 9.70534 0.563865 9.72979C0.659275 9.75423 0.758565 9.75964 0.856066 9.74572C0.953568 9.73179 1.04737 9.69879 1.13212 9.64861C1.21687 9.59843 1.29091 9.53205 1.35 9.45325C1.80409 8.8478 2.39291 8.35638 3.06983 8.01792C3.74675 7.67946 4.49318 7.50325 5.25 7.50325C6.00682 7.50325 6.75325 7.67946 7.43017 8.01792C8.10709 8.35638 8.69591 8.8478 9.15 9.45325C9.21986 9.5464 9.31045 9.622 9.41459 9.67407C9.51873 9.72614 9.63357 9.75325 9.75 9.75325C9.86643 9.75325 9.98127 9.72614 10.0854 9.67407C10.1896 9.622 10.2801 9.5464 10.35 9.45325C10.8041 8.8478 11.3929 8.35638 12.0698 8.01792C12.7468 7.67946 13.4932 7.50325 14.25 7.50325C15.0068 7.50325 15.7532 7.67946 16.4302 8.01792C17.1071 8.35638 17.6959 8.8478 18.15 9.45325C18.2092 9.53205 18.2833 9.59842 18.3681 9.64857C18.4529 9.69873 18.5467 9.73169 18.6443 9.74558C18.7418 9.75946 18.8411 9.754 18.9366 9.7295C19.032 9.705 19.1217 9.66194 19.2005 9.60278C19.2793 9.54363 19.3456 9.46953 19.3958 9.38473C19.4459 9.29992 19.4789 9.20606 19.4928 9.10852C19.5067 9.01097 19.5012 8.91165 19.4767 8.81622C19.4522 8.72078 19.4092 8.63111 19.35 8.55232C18.6859 7.66219 17.8003 6.96145 16.7812 6.51982C17.3398 6.01 17.7312 5.34322 17.904 4.60697C18.0769 3.87073 18.0231 3.09944 17.7497 2.39433C17.4763 1.68922 16.9961 1.08325 16.3721 0.655952C15.7481 0.228655 15.0095 0 14.2533 0C13.497 0 12.7584 0.228655 12.1345 0.655952C11.5105 1.08325 11.0303 1.68922 10.7569 2.39433C10.4835 3.09944 10.4297 3.87073 10.6025 4.60697C10.7753 5.34322 11.1667 6.01 11.7253 6.51982C10.9901 6.8376 10.322 7.29223 9.75656 7.8595C9.19112 7.29223 8.52302 6.8376 7.78781 6.51982C8.3464 6.01 8.73779 5.34322 8.91061 4.60697C9.08343 3.87073 9.02962 3.09944 8.75622 2.39433C8.48283 1.68922 8.00263 1.08325 7.37866 0.655952C6.75468 0.228655 6.0161 0 5.25984 0C4.50359 0 3.765 0.228655 3.14103 0.655952C2.51706 1.08325 2.03686 1.68922 1.76347 2.39433C1.49007 3.09944 1.43625 3.87073 1.60908 4.60697C1.7819 5.34322 2.17329 6.01 2.73188 6.51982C1.70805 6.95987 0.817737 7.66107 0.15 8.55325C0.0909055 8.63205 0.0479087 8.72171 0.023465 8.81712C-0.000978674 8.91253 -0.00639055 9.01182 0.00753824 9.10932C0.021467 9.20682 0.0544638 9.30062 0.104645 9.38537C0.154825 9.47012 0.221207 9.54416 0.3 9.60325Z" fill="#FBBE15"/>
                </svg>
                <span className="text-[14px] font-medium text-white/90 font-['Plus_Jakarta_Sans',sans-serif]">
                  Active Members
                </span>
              </div>

              <div className="my-1">
                <span className="text-[38px] font-bold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif] leading-none">
                  0
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-['Plus_Jakarta_Sans',sans-serif]">
                <span className="text-[#4ade80] font-medium flex items-center gap-1">
                  <span>▲</span> + 8.3% this weekend
                </span>
                <span className="text-white/40 hover:text-white transition-colors cursor-pointer flex items-center gap-0.5">
                  View details <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* 2. Active Paid Subscriptions Card */}
            <div
              style={{
                width: '322px',
                height: '160px',
                borderRadius: '25px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: '#161618',
                padding: '22px 24px 20px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
              }}
              className="shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <svg width="20" height="16" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <path d="M23.1087 10.7229H19.8325V7.678H23.1087C23.601 7.678 24 7.29249 24 6.81635C24 6.34016 23.601 5.95442 23.1087 5.95442H19.8325V1.72952C19.8325 1.11279 19.7065 0.660127 19.4581 0.384384C19.222 0.122064 18.9115 0 18.4817 0C18.0715 0 17.7727 0.121222 17.5412 0.381905C17.2956 0.657929 17.171 1.11144 17.171 1.7298V5.95494H11.0084L8.38812 2.12054C8.16387 1.77834 7.95301 1.4578 7.74825 1.15011C7.56389 0.873013 7.38408 0.647406 7.21424 0.478948C7.06388 0.329806 6.89254 0.214383 6.69213 0.125665C6.50303 0.0421845 6.26263 0.000280631 5.97821 0.000280631C5.61545 0.000280631 5.28616 0.0963883 4.97084 0.293842C4.65881 0.489144 4.44312 0.730606 4.31138 1.03207C4.19575 1.31857 4.13457 1.75758 4.13457 2.32426V5.95466H0.890965C0.398789 5.9547 0 6.34044 0 6.81658C0 7.29273 0.398789 7.67823 0.891013 7.67823H4.13462V10.7234H0.891013C0.398789 10.7234 0 11.1091 0 11.5854C0 12.0614 0.398789 12.4467 0.891013 12.4467H4.13462V17.2705C4.13462 17.869 4.26467 18.3171 4.52224 18.6018C4.76719 18.8733 5.07777 18.9993 5.49953 18.9993C5.90644 18.9993 6.2146 18.8727 6.47015 18.6007C6.73183 18.3221 6.8642 17.8743 6.8642 17.2705V12.4467H12.4407L15.4584 16.9216C15.6682 17.2174 15.8849 17.516 16.101 17.8087C16.2959 18.0716 16.5086 18.3033 16.733 18.4967C16.9351 18.6717 17.1518 18.8 17.377 18.8782C17.6088 18.9589 17.8798 18.9999 18.1805 18.9999C18.9966 18.9999 19.8324 18.7583 19.8324 16.9664V12.4467H23.1086C23.6009 12.4467 23.9999 12.0608 23.9999 11.5848C24 11.1088 23.601 10.7229 23.1087 10.7229ZM17.171 7.67795V10.7228H14.2673L12.1867 7.67795H17.171ZM6.86425 4.17931L8.06168 5.95442H6.86425V4.17931ZM6.86425 10.7229V7.678H9.22439L11.2781 10.7229H6.86425ZM17.171 14.9728L15.4453 12.4467H17.171V14.9728Z" fill="#FBBE15"/>
                </svg>
                <span className="text-[14px] font-medium text-white/90 font-['Plus_Jakarta_Sans',sans-serif]">
                  Active Paid Subscriptions
                </span>
              </div>

              <div className="my-1">
                <span className="text-[38px] font-bold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif] leading-none">
                  0
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-['Plus_Jakarta_Sans',sans-serif]">
                <span className="text-[#4ade80] font-medium flex items-center gap-1">
                  <span>▲</span> + 12% this weekend
                </span>
                <span className="text-white/40 hover:text-white transition-colors cursor-pointer flex items-center gap-0.5">
                  View details <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* 3. Gross Revenue Card */}
            <div
              style={{
                width: '322px',
                height: '160px',
                borderRadius: '25px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: '#161618',
                padding: '22px 24px 20px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
              }}
              className="shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                {/* Banknote SVG matching Figma */}
                <svg width="22" height="14" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <rect x="1" y="1" width="22" height="14" rx="2" stroke="#FBBE15" strokeWidth="1.6" fill="none"/>
                  <circle cx="12" cy="8" r="3" stroke="#FBBE15" strokeWidth="1.6" fill="none"/>
                  <path d="M4.5 1.5V3.5H2" stroke="#FBBE15" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.5 1.5V3.5H22" stroke="#FBBE15" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.5 14.5V12.5H2" stroke="#FBBE15" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.5 14.5V12.5H22" stroke="#FBBE15" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[14px] font-medium text-white/90 font-['Plus_Jakarta_Sans',sans-serif]">
                  Gross Revenue
                </span>
              </div>

              <div className="my-1">
                <span className="text-[38px] font-bold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif] leading-none">
                  0
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-['Plus_Jakarta_Sans',sans-serif]">
                <span className="text-[#4ade80] font-medium flex items-center gap-1">
                  <span>▲</span> + 12% this weekend
                </span>
                <span className="text-white/40 hover:text-white transition-colors cursor-pointer flex items-center gap-0.5">
                  View details <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Performance Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Performance
            </h2>

            {/* Performance Main Box (911x440px, r: 18px, border 1px) */}
            <div
              style={{
                width: '100%',
                maxWidth: '911px',
                height: '440px',
                borderRadius: '18px',
                backgroundColor: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                boxSizing: 'border-box',
              }}
              className="shadow-xl flex flex-col items-center justify-center text-center px-6 relative"
            >
              <div className="flex flex-col items-center gap-7 max-w-[580px]">
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '24px',
                    lineHeight: '140%',
                    letterSpacing: '-0.03em',
                    textAlign: 'center',
                    color: '#FFFFFF',
                  }}
                  className="m-0"
                >
                  You have no content, upload more videos<br className="hidden sm:inline" /> and photos to view your metrics
                </p>

                <button
                  type="button"
                  onClick={onNavigateToContent}
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    height: '48px',
                    borderRadius: '40px',
                    paddingLeft: '40px',
                    paddingRight: '40px',
                    backgroundColor: '#FBBE15',
                    color: '#000000',
                  }}
                  className="hover:brightness-105 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center whitespace-nowrap"
                >
                  Head over to content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
