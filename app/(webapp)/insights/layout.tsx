import {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Insights & Analytics | LocalBuka',
  description:
    'Track your content performance, discoverability, reach across the world and community growth on LocalBuka.',
};

export default function InsightsLayout({children}: {children: React.ReactNode}) {
  return <>{children}</>;
}
