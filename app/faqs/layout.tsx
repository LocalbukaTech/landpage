import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs - Frequently Asked Questions",
  description: "Find answers to common questions about LocalBuka. Learn about our services, restaurant listings, food discovery features, and how to get the most out of our platform.",
  keywords: [
    "LocalBuka FAQ",
    "frequently asked questions",
    "help",
    "support",
    "how to use LocalBuka",
    "restaurant app help",
  ],
  openGraph: {
    title: "FAQs - LocalBuka Help Center",
    description: "Find answers to common questions about LocalBuka and our food discovery platform.",
    type: "website",
    url: "https://localbuka.com/faqs",
  },
  twitter: {
    card: "summary",
    title: "FAQs - LocalBuka Help Center",
    description: "Find answers to common questions about LocalBuka and our food discovery platform.",
  },
};

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
