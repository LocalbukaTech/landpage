import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your LocalBuka profile, view your saved spots, and your food journey.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
