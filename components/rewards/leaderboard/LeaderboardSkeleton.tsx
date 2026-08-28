export function LeaderboardSkeleton() {
  return (
    <div className='flex flex-col gap-6 mb-8'>
      {/* Top Podium Skeleton */}
      <div className='bg-[#161616] border border-white/10 rounded-2xl p-6 shadow-lg'>
        <div className='w-36 h-4 bg-white/10 rounded mb-6 animate-pulse' />
        <div className='flex gap-5 overflow-x-auto scrollbar-hide pb-2 pt-2'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='flex flex-col items-center shrink-0 animate-pulse' style={{ width: 74 }}>
              <div className='w-[74px] h-[74px] rounded-full bg-white/10' />
              <div className='w-14 h-3 bg-white/10 rounded mt-2.5' />
              <div className='w-10 h-2.5 bg-white/10 rounded mt-1' />
            </div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className='bg-[#161616] border border-white/10 rounded-2xl overflow-hidden shadow-lg'>
        <div className='w-full overflow-x-auto scrollbar-thin'>
          <div className='min-w-[520px] divide-y divide-white/5'>
            <div className='grid grid-cols-[1fr_130px_150px] items-center px-5 py-3.5 border-b border-white/10 bg-white/[0.02]'>
              <div className='w-24 h-3 bg-white/10 rounded animate-pulse' />
              <div className='w-16 h-3 bg-white/10 rounded animate-pulse ml-auto mr-4' />
              <div className='w-20 h-3 bg-white/10 rounded animate-pulse ml-auto' />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='grid grid-cols-[1fr_130px_150px] items-center px-5 py-3.5 animate-pulse'>
                <div className='flex items-center gap-3.5 pr-2'>
                  <div className='w-6 h-4 bg-white/10 rounded' />
                  <div className='w-10 h-10 rounded-full bg-white/10' />
                  <div className='flex flex-col gap-1.5'>
                    <div className='w-24 h-3.5 bg-white/10 rounded' />
                    <div className='w-16 h-2.5 bg-white/10 rounded' />
                  </div>
                </div>
                <div className='text-right pr-4'>
                  <div className='w-16 h-3 bg-white/10 rounded ml-auto' />
                </div>
                <div className='flex flex-col items-end gap-1'>
                  <div className='w-16 h-3.5 bg-white/10 rounded' />
                  <div className='w-12 h-2.5 bg-white/10 rounded' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
