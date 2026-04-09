"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Legacy page - redirects to the new my-restaurant management page
export default function SuccessPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/buka/my-restaurant");
  }, [router]);
  return null;
}
