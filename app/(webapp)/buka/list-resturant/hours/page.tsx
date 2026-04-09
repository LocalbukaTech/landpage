"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Legacy page - redirects to the new unified list restaurant flow
export default function BusinessHoursPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/buka/list-resturant");
  }, [router]);
  return null;
}
