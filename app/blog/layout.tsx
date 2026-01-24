import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - News & Food Stories",
  description: "Explore the latest food trends, Nigerian cuisine insights, restaurant reviews, cooking tips, and culinary stories from LocalBuka. Stay updated with the food world.",
  keywords: [
    "food blog",
    "Nigerian food blog",
    "restaurant reviews",
    "cooking tips",
    "food stories",
    "culinary news",
    "African cuisine blog",
  ],
  openGraph: {
    title: "Blog - LocalBuka Food Stories",
    description: "Explore the latest food trends, Nigerian cuisine insights, restaurant reviews, and culinary stories.",
    type: "website",
    url: "https://localbuka.com/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - LocalBuka Food Stories",
    description: "Explore the latest food trends, Nigerian cuisine insights, restaurant reviews, and culinary stories.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
