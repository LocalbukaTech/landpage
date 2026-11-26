import Image from 'next/image';
import { Reveal } from '@/components/anim/Reveal';

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      {/* Soft oversized decorative background rings */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-44 -left-36 h-[590px] w-[590px] rounded-full border-[18px] border-[#fffaf0]" />
        <div className="absolute -bottom-72 left-[34%] h-[620px] w-[620px] rounded-full border-[18px] border-[#fffaf0]" />
        <div className="absolute top-[18%] right-[2%] h-[430px] w-[430px] rounded-full border-[18px] border-[#fffaf0]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-84px)] max-w-[1440px] items-center gap-4 px-6 pb-10 pt-4 md:px-12 lg:grid-cols-[1.32fr_0.68fr] lg:px-16 xl:px-20">
        {/* Left content */}
        <div className="max-w-[830px] lg:pt-2">
          <Reveal direction="up" duration={0.7}>
            <div className="mb-7 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  '/images/avatar-meghan.png',
                  '/images/avatar-jane.jpg',
                  '/images/avatar-johnbull.jpg',
                  '/images/avatar-philomina.jpg',
                ].map((src, index) => (
                  <div
                    key={src}
                    className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-white bg-[#eee] md:h-12 md:w-12"
                  >
                    <Image
                      src={src}
                      alt="LocalBuka community member"
                      fill
                      sizes="48px"
                      className="object-cover"
                      priority={index < 2}
                    />
                  </div>
                ))}
              </div>
              <p className="text-[15px] text-[#091f3c] md:text-lg">
                Join <strong className="font-bold">+3.5k</strong> other food lovers
              </p>
            </div>
          </Reveal>

          <Reveal
            as="h1"
            direction="up"
            duration={0.8}
            className="mb-6 text-[44px] font-black leading-[1.08] tracking-[-0.035em] text-[#062044] sm:text-[58px] lg:text-[64px] xl:text-[72px]"
          >
            Effortless food discovery,
            <br className="hidden lg:block" />
            zero guesswork.
          </Reveal>

          <Reveal
            as="p"
            direction="up"
            delay={0.15}
            duration={0.8}
            className="mb-8 max-w-[790px] text-lg leading-[1.45] text-[#414141] md:text-[21px] lg:text-[23px]"
          >
            Browse real meals and see nearby restaurants and food spots by location,
            price and recommendations, so you can see where or what&apos;s worth trying.
          </Reveal>

          <Reveal direction="up" delay={0.25}>
            <a
              href="#discover"
              className="group inline-flex min-h-[68px] items-center gap-5 rounded-[11px] bg-[#ffb914] px-9 py-4 text-lg font-bold text-[#062044] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f5a900] hover:shadow-xl md:px-11 md:text-xl"
            >
              Find what to eat now
              <span className="text-3xl leading-none transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </a>
          </Reveal>
        </div>

        {/* Right visual */}
        <div className="relative hidden min-h-[660px] items-center justify-center lg:flex">
          <div className="absolute h-[420px] w-[420px] rounded-full border border-[#fbbf34] opacity-70" />

          <div className="relative z-10 h-[575px] w-[341px] rotate-[3deg] drop-shadow-[0_24px_28px_rgba(6,32,68,0.16)]">
            <Image
              src="/images/Free Transparent iPhone 18 Pro Mockup (Mockuuups Studio).png"
              alt="LocalBuka app showing a local food creator"
              fill
              priority
              sizes="341px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
