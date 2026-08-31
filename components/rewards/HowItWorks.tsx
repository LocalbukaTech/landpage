import { Folder, Gift, UserPlus } from "lucide-react"


const HowItWorks = () => {
  return (
    <div className='flex flex-col p-6 sm:p-8 bg-[#161616] border border-white/10 rounded-2xl'>
                  {/* Header */}
                  <div className='flex flex-col gap-1 pb-5 border-b border-white/10'>
                    <h3 className='text-xl sm:text-2xl font-bold text-white m-0'>How it works</h3>
                    <p className='text-sm text-zinc-400 m-0'>Learn how to earn, accumulate and use your points</p>
                  </div>

                  {/* Steps List */}
                  <div className='flex flex-col gap-8 pt-6'>
                    {/* 1. Earn Points */}
                    <div className='flex items-start gap-4'>
                      <div className='w-11 h-11 rounded-full bg-[#0a2540] text-[#38bdf8] flex items-center justify-center shrink-0 mt-0.5 shadow-sm'>
                        <UserPlus size={20} />
                      </div>
                      <div className='flex flex-col gap-1.5'>
                        <h4 className='text-base sm:text-lg font-bold text-white m-0'>1. Earn Points</h4>
                        <ul className='space-y-1 text-sm text-zinc-300 list-disc list-inside m-0 p-0'>
                          <li>Earn 50 points for every successful referral</li>
                        </ul>
                      </div>
                    </div>

                    {/* 2. Accumulate Points */}
                    <div className='flex items-start gap-4'>
                      <div className='w-11 h-11 rounded-full bg-[#9a6a0b] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm'>
                        <Folder size={20} />
                      </div>
                      <div className='flex flex-col gap-1.5'>
                        <h4 className='text-base sm:text-lg font-bold text-white m-0'>2. Accumulate Points</h4>
                        <ul className='space-y-1 text-sm text-zinc-300 list-disc list-inside m-0 p-0'>
                          <li>Accumulate your points in your account</li>
                          <li>Your points will remain safely stored in your accounts.</li>
                        </ul>
                      </div>
                    </div>

                    {/* 3. Use Points */}
                    <div className='flex items-start gap-4'>
                      <div className='w-11 h-11 rounded-full bg-[#34a853] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm'>
                        <Gift size={20} />
                      </div>
                      <div className='flex flex-col gap-1.5'>
                        <h4 className='text-base sm:text-lg font-bold text-white m-0'>3. Use Points</h4>
                        <ul className='space-y-1 text-sm text-zinc-300 list-disc list-inside m-0 p-0'>
                          <li>Use your points for available reward such as airtime and data in supported region</li>
                          <li>Your point brings you real value</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
  )
}

export default HowItWorks