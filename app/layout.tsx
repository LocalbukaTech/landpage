import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollToTop } from "@/components/common";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800", "900"],
});

const hakuna = localFont({
  src: "../public/fonts/Hakuna.otf",
  variable: "--font-display",
  weight: "400",
  display: "swap",
});

// Site configuration
const siteConfig = {
  name: "LocalBuka",
  description: "Find the best restaurants - from hidden gems to local favorites - in any city. Discover authentic Nigerian cuisine, local food spots, and culinary experiences near you.",
  url: "https://localbuka.com",
  ogImage: "/images/og-image.png",
  keywords: [
    "LocalBuka",
    "restaurants",
    "Nigerian cuisine",
    "local food",
    "food discovery",
    "restaurant finder",
    "buka",
    "African food",
    "food delivery",
    "restaurant reviews",
    "nearby restaurants",
    "food app",
    "culinary experiences",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBBE15" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1F44" },
  ],
};

export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: "LocalBuka - Taste the world, one plate at a time",
    template: "%s | LocalBuka",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "LocalBuka Team", url: siteConfig.url }],
  creator: "LocalBuka",
  publisher: "LocalBuka",
  
  // Favicon and icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  
  // Manifest for PWA
  manifest: "/manifest.json",
  
  // Open Graph metadata for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "LocalBuka - Taste the world, one plate at a time",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "LocalBuka - Discover local restaurants and authentic cuisine",
      },
    ],
  },
  
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "LocalBuka - Taste the world, one plate at a time",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@localbuka",
    site: "@localbuka",
  },
  
  // Robots directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Verification tags
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
  
  // Additional metadata
  category: "Food & Drink",
  
  // Other metadata
  other: {
    "google-adsense-account": "ca-pub-2319578381550272",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-2319578381550272" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://localbuka.com" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${nunitoSans.variable} ${hakuna.variable} font-sans antialiased`}
      >
        <ScrollToTop />
        <Providers>
          {children}

          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}
