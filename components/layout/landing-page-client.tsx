'use client';

//import { FoodLoversSection } from '@/components/sections/food-lovers-section';
//import { WhyLocalBukaSection } from '@/components/sections/why-localbuka-section';
//import { AppDownloadSection } from '@/components/sections/app-download-section';
//import { TeamSection } from '@/components/sections/team-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
//import { FAQSection } from '@/components/sections/faq-section';
//import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { Navbar } from '@/components/layout/navbar';
import { MealExplorerSection } from '@/components/sections/mealexplore'; 
import {OwnerCtaSection} from '@/components/sections/owner-cta'; 
import {TeamSection} from '@/components/sections/team';
import {FooterMew} from '@/components/layout/footermew';  


export function LandingPageClient() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <TestimonialsSection />
      <MealExplorerSection />
      <OwnerCtaSection />
      <TeamSection />
      {/* <FoodLoversSection /> */}
      {/* <WhyLocalBukaSection /> */}
      {/* <AppDownloadSection /> */}
     
      {/*<TeamSection />*/}
      
      {/* {<FAQSection />} */}
      <FooterMew />
    </>
  );
}
