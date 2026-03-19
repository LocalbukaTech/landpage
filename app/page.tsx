import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LandingPageClient } from '@/components/layout/landing-page-client';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('localbuka_user_token');

  if (token) {
    redirect('/feeds');
  }

  return <LandingPageClient />;
}
