import Image from 'next/image';
import { FEATURES } from '@/lib/constants';
import SectionHeader from '../SectionHeader';
import { Reveal } from '@/components/anim/Reveal';

export function WhyLocalBukaSection() {
  return (
    <section className="py-10 bg-white dark:bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Why LocalBuka" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {FEATURES.map((item, idx) => (
            <Reveal key={idx} direction="up" delay={idx * 0.06} duration={0.45}>
              <div className="relative aspect-[16/10] sm:aspect-[4/5] rounded-2xl overflow-hidden group cursor-pointer">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6">
                  <h3 className="font-extrabold text-xl sm:text-2xl lg:text-3xl text-white leading-none mb-1 sm:mb-2">
                    {idx <= 8 ? `0${idx + 1}.` : `${idx + 1}.`}
                  </h3>
                  <h4 className="font-bold text-sm sm:text-base lg:text-xl text-white line-clamp-3 min-h-[3.25rem] sm:min-h-[4.5rem] leading-snug">
                    {item.title}
                  </h4>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

