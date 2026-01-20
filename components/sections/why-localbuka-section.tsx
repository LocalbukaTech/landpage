import Image from 'next/image';
import {Card, CardContent} from '@/components/ui/card';
import {FEATURES} from '@/lib/constants';
import SectionHeader from '../SectionHeader';
import {Reveal} from '@/components/anim/Reveal';

export function WhyLocalBukaSection() {
  return (
    <section className='py-10 bg-white dark:bg-muted/20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <SectionHeader title='Why LocalBuka' />
        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {FEATURES.map((item, idx) => (
            <Reveal key={idx} direction='up' delay={idx * 0.06} duration={0.45}>
              <Card className='overflow-hidden group cursor-pointer hover:shadow-xl transition-all border-0'>
                <div className='relative h-56 overflow-hidden'>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                </div>
                <CardContent className='p-5 bg-white dark:bg-card'>
                  <h3 className='font-extrabold text-2xl text-primary'>
                    {idx <= 9 ? `0${idx + 1}` : idx + 1}.
                  </h3>
                  <h3 className='font-bold text-base'>{item.title}</h3>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
