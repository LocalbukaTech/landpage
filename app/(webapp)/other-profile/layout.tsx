import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile",
  description: "View user profiles and their food discovery journey on LocalBuka.",
};

export default function OtherProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
