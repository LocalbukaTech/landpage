'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { HeroSection } from '@/components/sections/hero-section';
import { FoodLoversSection } from '@/components/sections/food-lovers-section';
import { WhyLocalBukaSection } from '@/components/sections/why-localbuka-section';
import { AppDownloadSection } from '@/components/sections/app-download-section';
import { TeamSection } from '@/components/sections/team-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { FAQSection } from '@/components/sections/faq-section';
import { Footer } from '@/components/layout/footer';
import { WaitlistModal } from '@/components/modals/waitlist-modal';

const WAITLIST_MODAL_SHOWN_KEY = 'waitlist_auto_shown';
const WAIT_TIME_MS = 3 * 60 * 1000; // 3 minutes

export function LandingPageClient() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  useEffect(() => {
    // Check if the modal has already been shown in this session
    const hasBeenShown = sessionStorage.getItem(WAITLIST_MODAL_SHOWN_KEY);

    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsWaitlistOpen(true);
        sessionStorage.setItem(WAITLIST_MODAL_SHOWN_KEY, 'true');
      }, WAIT_TIME_MS);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />
      <FoodLoversSection />
      <WhyLocalBukaSection />
      <AppDownloadSection />
      <TeamSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
      
      <WaitlistModal 
        open={isWaitlistOpen} 
        onOpenChange={setIsWaitlistOpen} 
      />
    </>
  );
}
