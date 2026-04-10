import { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Restaurants - LocalBuka",
  description: "Manage your restaurant listings on LocalBuka.",
};
export default function MyRestaurantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
