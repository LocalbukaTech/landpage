import {Footer} from '@/components/layout/footer';
import {Navbar} from '@/components/layout/navbar';
import SectionHeader from '@/components/SectionHeader';
import {Metadata} from 'next';
import {TeamsByDepartment} from '@/components/team/teams-by-department';

export const metadata: Metadata = {
  title: 'Our Team - Meet the People Behind LocalBuka',
  description: 'Meet the passionate team behind LocalBuka. Our diverse group of food enthusiasts, engineers, and creatives work together to bring you the best food discovery experience.',
  keywords: ['LocalBuka team', 'about us', 'our team', 'company team', 'food tech team'],
  openGraph: {
    title: 'Our Team - LocalBuka',
    description: 'Meet the passionate team behind LocalBuka bringing you the best food discovery experience.',
    type: 'website',
    url: 'https://localbuka.com/team',
  },
  twitter: {
    card: 'summary',
    title: 'Our Team - LocalBuka',
    description: 'Meet the passionate team behind LocalBuka bringing you the best food discovery experience.',
  },
};
export default function TeamPage() {
  const teamSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': 'https://localbuka.com/team#webpage',
        url: 'https://localbuka.com/team',
        name: 'Our Team - Meet the People Behind LocalBuka',
        description:
          'Meet the passionate team behind LocalBuka working together to bring you the best food discovery experience.',
        isPartOf: { '@id': 'https://localbuka.com/#website' },
        about: { '@id': 'https://localbuka.com/#organization' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://localbuka.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Our Team',
            item: 'https://localbuka.com/team',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
      />
      <main className='bg-[#FFF9E8] dark:bg-black'>
        <Navbar />
        <div className='py-30'>
          <div className='text-center mb-12'>
            <div className='flex flex-row justify-center w-full'>
              <SectionHeader title='Meet the Team' />
            </div>
            <p className='text-muted-foreground text-lg mt-4'>
              The people behind our success
            </p>
          </div>
        </div>

        <div className='bg-white dark:bg-black'>
          <TeamsByDepartment />
        </div>
      </main>
      <Footer />
    </>
  );
}
