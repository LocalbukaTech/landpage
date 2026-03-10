import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Join the Waitlist',
  description:
    'Be the first to experience the LocalBuka App! Sign up for early access and get notified when we launch on the App & Play Store. Discover local restaurants and authentic cuisine.',
  openGraph: {
    title: 'Join the LocalBuka Waitlist — Get Early Access',
    description:
      'Be the first to experience the LocalBuka App. Sign up for early access and get notified when we launch!',
    url: 'https://localbuka.com/join-waitlist',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Join the LocalBuka Waitlist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join the LocalBuka Waitlist — Get Early Access',
    description:
      'Be the first to experience the LocalBuka App. Sign up now for early access!',
    images: ['/images/og-image.png'],
  },
};

export default function JoinWaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
