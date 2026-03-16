import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feeds",
  description: "Explore the latest local food videos and reviews on LocalBuka.",
};

export default function FeedsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
