import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy & Terms of Service",
  description: "Read LocalBuka's Privacy Policy, Terms of Service, and Community Guidelines. Learn how we protect your data and what rules govern our platform.",
  keywords: [
    "privacy policy",
    "terms of service",
    "data protection",
    "user agreement",
    "community guidelines",
    "LocalBuka legal",
  ],
  openGraph: {
    title: "Privacy Policy & Terms - LocalBuka",
    description: "Read LocalBuka's Privacy Policy, Terms of Service, and Community Guidelines.",
    type: "website",
    url: "https://localbuka.com/privacy",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy & Terms - LocalBuka",
    description: "Read LocalBuka's Privacy Policy, Terms of Service, and Community Guidelines.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
