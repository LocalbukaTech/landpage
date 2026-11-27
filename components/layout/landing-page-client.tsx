'use client';

import { LandingNavbar } from '@/components/layout/landing-navbar';
import { HeroSection } from '@/components/sections/hero-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { MealExplorerSection } from '@/components/sections/mealexplore';
import { OwnerCtaSection } from '@/components/sections/owner-cta';
import { TeamSection } from '@/components/sections/team';
import { FooterMew } from '@/components/layout/footermew';

export function LandingPageClient() {
  return (
    <div className='min-h-screen bg-white'>
      <LandingNavbar />
      <HeroSection />
      <TestimonialsSection />
      <MealExplorerSection />
      <OwnerCtaSection />
      <TeamSection />
      <FooterMew />
    </div>
  );
}
