import {Footer} from '@/components/layout/footer';
import {Navbar} from '@/components/layout/navbar';
import SectionHeader from '@/components/SectionHeader';
import {Metadata} from 'next';
import {TeamsByDepartment} from '@/components/team/teams-by-department';

export const metadata: Metadata = {
  title: 'Our Team',
  description: `The people behind our success`,
};
export default function TeamPage() {
  return (
    <>
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
