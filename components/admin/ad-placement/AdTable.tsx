// components/admin/ad-placement/AdTable.tsx
"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { AdStatusBadge } from "./AdStatusBadge";

const mockAds = [
  { id: "LD-001", campaign: "Ad Name", duration: "09 - 11 Dec, 2025", budget: "Daily", amount: "5,000", status: "Active" },
  { id: "LD-002", campaign: "Ad Name", duration: "09 - 11 Dec, 2025", budget: "Daily", amount: "5,000", status: "Completed" },
  // ... add more mock data as per your design
];

export function AdTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-gray-400 font-medium border-b border-gray-50">
            <th className="p-4 w-10"><input type="checkbox" className="rounded accent-[#fbbe15]" /></th>
            <th className="p-4">User ID</th>
            <th className="p-4">Campaign</th>
            <th className="p-4">Duration</th>
            <th className="p-4">Budget</th>
            <th className="p-4">Amount (₦)</th>
            <th className="p-4">Status</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {mockAds.map((ad) => (
            <tr key={ad.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="p-4"><input type="checkbox" className="rounded accent-[#fbbe15]" /></td>
              <td className="p-4 font-medium text-gray-700">{ad.id}</td>
              <td className="p-4 text-gray-500">{ad.campaign}</td>
              <td className="p-4 text-gray-500">{ad.duration}</td>
              <td className="p-4 text-gray-500">{ad.budget}</td>
              <td className="p-4 text-gray-900 font-semibold">{ad.amount}</td>
              <td className="p-4"><AdStatusBadge status={ad.status} /></td>
              <td className="p-4 text-right">
                <Link href={`/secure-admin/ad-placements/${ad.id}`}>
                  <button className="text-gray-300 hover:text-gray-600 transition">
                    <Eye size={18} />
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}