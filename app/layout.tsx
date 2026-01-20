import type {Metadata} from 'next';
import {Nunito_Sans} from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import {Providers} from '@/components/providers';
import {ThemeToggle} from '@/components/theme-toggle';

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800', '900'],
});

const hakuna = localFont({
  src: '../public/fonts/Hakuna.otf',
  variable: '--font-display',
  weight: '400',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LocalBuka - Taste the world, one plate at a time',
  description: `Find the best restaurants - from hidden gems to local favorites - in any city.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${nunitoSans.variable} ${hakuna.variable} font-sans antialiased`}>
        <Providers>
          {children}

          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}
