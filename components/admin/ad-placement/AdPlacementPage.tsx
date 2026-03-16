"use client";

import { Search, Calendar, SlidersHorizontal, Eye, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AdStatusBadge } from "@/components/admin/ad-placement/AdStatusBadge";

const mockAds = [
  { id: "LB-001", campaign: "Ad Name", duration: "09 - 11 Dec, 2025", budget: "Daily", amount: "5,000", status: "Active" },
  { id: "LB-002", campaign: "Ad Name", duration: "09 - 11 Dec, 2025", budget: "Daily", amount: "5,000", status: "Completed" },
  { id: "LB-003", campaign: "Ad Name", duration: "09 - 11 Dec, 2025", budget: "Lifetime", amount: "5,000", status: "Pending" },
  { id: "LB-004", campaign: "Ad Name", duration: "09 - 11 Dec, 2025", budget: "Daily", amount: "5,000", status: "Active" },
  { id: "LB-005", campaign: "Ad Name", duration: "09 - 11 Dec, 2025", budget: "Daily", amount: "5,000", status: "Completed" },
  { id: "LB-006", campaign: "Ad Name", duration: "09 - 11 Dec, 2025", budget: "Daily", amount: "5,000", status: "Pending" },
  { id: "LB-007", campaign: "Ad Name", duration: "09 - 11 Dec, 2025", budget: "Daily", amount: "5,000", status: "Active" },
  { id: "LB-008", campaign: "Ad Name", duration: "09 - 11 Dec, 2025", budget: "Daily", amount: "5,000", status: "Completed" },
];

export default function AdPlacementPage() {
  return (
    /* Adjusted: Removed p-10 and bg-white to prevent "double padding" look */
    <div className="space-y-8 w-full"> 
      {/* Search and Filters Bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by email" 
            className="w-full pl-12 pr-4 py-3 bg-[#F8F9FA] border-none rounded-xl text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#fbbe15]"
          />
        </div>
        
        <div className="flex items-center gap-8 text-sm font-medium text-zinc-500">
          <button className="flex items-center gap-2 hover:text-zinc-900 transition-colors">
            <Calendar size={18} /> Date
          </button>
          <button className="flex items-center gap-2 hover:text-zinc-900 transition-colors">
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>
      </div>

      {/* Ad Table Container */}
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="text-[#1e293b] border-b border-zinc-50 bg-[#F8F9FA]/50">
              <th className="p-5 w-14 text-center">
                <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 accent-[#fbbe15] cursor-pointer" />
              </th>
              <th className="p-5 font-bold">User ID</th>
              <th className="p-5 font-bold">Campaign</th>
              <th className="p-5 font-bold">Duration</th>
              <th className="p-5 font-bold">Budget</th>
              <th className="p-5 font-bold">Amount (N)</th>
              <th className="p-5 font-bold">
                <div className="flex items-center justify-between">
                  Status
                  <SlidersHorizontal size={14} className="text-zinc-300" />
                </div>
              </th>
              <th className="p-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {mockAds.map((ad) => (
              <tr key={ad.id} className="group hover:bg-zinc-50/30 transition-colors text-zinc-600">
                <td className="p-5 text-center">
                  <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 accent-[#fbbe15] cursor-pointer" />
                </td>
                <td className="p-5 font-medium text-zinc-900">
                  <Link href={`/secure-admin/ad-placements/${ad.id}`} className="hover:text-[#fbbe15]">
                    {ad.id}
                  </Link>
                </td>
                <td className="p-5">{ad.campaign}</td>
                <td className="p-5 text-zinc-400">{ad.duration}</td>
                <td className="p-5 text-zinc-400">{ad.budget}</td>
                <td className="p-5 font-medium">{ad.amount}</td>
                <td className="p-5">
                  <AdStatusBadge status={ad.status as any} />
                </td>
                <td className="p-5 text-right">
                  <Link href={`/secure-admin/ad-placements/${ad.id}`}>
                    <button className="text-zinc-300 hover:text-zinc-900 transition-colors">
                      <Eye size={20} />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-4 pb-10">
        <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-all">
          <ArrowLeft size={16} /> Previous
        </button>
        
        <div className="flex items-center gap-2">
          {[1, 2, 3, "...", 8, 9, 10].map((page, i) => (
            <button 
              key={i}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                page === 1 ? "bg-[#FFF9E5] text-[#fbbe15]" : "text-zinc-400 hover:bg-zinc-50"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-all">
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}