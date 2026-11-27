import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Metadata } from 'next';
import { TeamsByDepartment } from '@/components/team/teams-by-department';

export const metadata: Metadata = {
  title: 'Our Team - Meet the People Behind LocalBuka',
  description:
    'Meet the passionate team behind LocalBuka. Our diverse group of food enthusiasts, engineers, and creatives work together to bring you the best food discovery experience.',
  keywords: [
    'LocalBuka team',
    'about us',
    'our team',
    'company team',
    'food tech team',
  ],
  openGraph: {
    title: 'Our Team - LocalBuka',
    description:
      'Meet the passionate team behind LocalBuka bringing you the best food discovery experience.',
    type: 'website',
    url: 'https://localbuka.com/team',
  },
  twitter: {
    card: 'summary',
    title: 'Our Team - LocalBuka',
    description:
      'Meet the passionate team behind LocalBuka bringing you the best food discovery experience.',
  },
};

export default function TeamPage() {
  return (
    <>
      <main className='min-h-screen bg-[#FDF9ED]'>
        <Navbar />
        <TeamsByDepartment />
      </main>
      <Footer />
    </>
  );
}
