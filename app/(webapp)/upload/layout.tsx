import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Video",
  description: "Share your food experiences with the LocalBuka community by uploading a video.",
};

export default function UploadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
