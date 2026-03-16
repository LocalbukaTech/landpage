import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buka - Discover Restaurants",
  description: "Find the best local restaurants and bukads near you on LocalBuka.",
};

export default function BukaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
