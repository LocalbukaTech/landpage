import {Navbar} from '@/components/layout/navbar';
import {HeroSection} from '@/components/sections/hero-section';
import {FoodLoversSection} from '@/components/sections/food-lovers-section';
import {WhyLocalBukaSection} from '@/components/sections/why-localbuka-section';
import {AppDownloadSection} from '@/components/sections/app-download-section';
import {TeamSection} from '@/components/sections/team-section';
import {TestimonialsSection} from '@/components/sections/testimonials-section';
import {FAQSection} from '@/components/sections/faq-section';
import {Footer} from '@/components/layout/footer';

export default function Home() {
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
    </>
  );
}
