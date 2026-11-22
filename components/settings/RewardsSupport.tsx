'use client';

interface RewardsSupportProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
  mode?: 'refer' | 'support' | 'all';
}

export function RewardsSupport(_props: RewardsSupportProps = {}) {

  const handleChatSupport = () => {
    window.open('mailto:support@localbuka.com?subject=Support%20Chat%20Inquiry', '_blank');
  };

  const handleEmailSupport = () => {
    window.location.href = 'mailto:support@localbuka.com?subject=Support%20Inquiry';
  };

  return (
    <div className='flex flex-col text-white'>
      <div className='flex flex-col gap-8 max-w-[540px] pt-2'>
        {/* Contact Support */}
        <div className='flex items-center justify-between gap-4'>
          <div>
            <h4 className='text-[16px] font-semibold text-white m-0'>
              Contact Support
            </h4>
            <p className='text-[13px] text-zinc-400 mt-1 mb-0'>
              Chat our support team for help.
            </p>
          </div>
          <button
            onClick={handleChatSupport}
            className='px-5 py-2 bg-[#FBBE15] text-[#1a1a1a] text-[12px] font-bold rounded-full border-none cursor-pointer hover:bg-[#e5ab13] transition-colors whitespace-nowrap shadow-sm'>
            Chat with Support
          </button>
        </div>

        {/* Email Support */}
        <div className='flex items-center justify-between gap-4'>
          <div>
            <h4 className='text-[16px] font-semibold text-white m-0'>
              Email Support
            </h4>
            <p className='text-[13px] text-zinc-400 mt-1 mb-0'>
              Email our support team for help.
            </p>
          </div>
          <button
            onClick={handleEmailSupport}
            className='px-6 py-2 bg-[#FBBE15] text-[#1a1a1a] text-[12px] font-bold rounded-full border-none cursor-pointer hover:bg-[#e5ab13] transition-colors whitespace-nowrap shadow-sm'>
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}
