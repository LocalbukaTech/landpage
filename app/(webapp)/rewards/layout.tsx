import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rewards & Support",
  description: "View your rewards, refer friends, and access support on LocalBuka.",
};

export default function RewardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
