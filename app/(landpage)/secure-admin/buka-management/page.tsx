"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Calendar, SlidersHorizontal, Eye } from "lucide-react";
import { StatusBadge, BadgeStatus } from "@/components/admin/ui/StatusBadge";
import { Pagination } from "@/components/admin/ui/Pagination";
import { MdVerified } from "react-icons/md";

// Mock Data matching the screenshot for Buka Management
const MOCK_BUKAS = [
  { id: "RT-001", name: "Restaurant Name", address: "No 16, Fola Str, Lagos...", date: "24/12/25", addedBy: "John Doe", status: "Active", verified: true },
  { id: "RT-002", name: "Restaurant Name", address: "No 16, Fola Str, Lagos...", date: "24/12/25", addedBy: "John Doe", status: "Rejected", verified: false },
  { id: "RT-003", name: "Restaurant Name", address: "No 16, Fola Str, Lagos...", date: "24/12/25", addedBy: "John Doe", status: "Pending", verified: false },
  { id: "RT-004", name: "Restaurant Name", address: "No 16, Fola Str, Lagos...", date: "24/12/25", addedBy: "John Doe", status: "Active", verified: true },
  { id: "RT-005", name: "Restaurant Name", address: "No 16, Fola Str, Lagos...", date: "24/12/25", addedBy: "John Doe", status: "Rejected", verified: false },
  { id: "RT-006", name: "Restaurant Name", address: "No 16, Fola Str, Lagos...", date: "24/12/25", addedBy: "John Doe", status: "Pending", verified: false },
  { id: "RT-007", name: "Restaurant Name", address: "No 16, Fola Str, Lagos...", date: "24/12/25", addedBy: "John Doe", status: "Active", verified: false },
  { id: "RT-008", name: "Restaurant Name", address: "No 16, Fola Str, Lagos...", date: "24/12/25", addedBy: "John Doe", status: "Rejected", verified: false },
  { id: "RT-009", name: "Restaurant Name", address: "No 16, Fola Str, Lagos...", date: "24/12/25", addedBy: "John Doe", status: "Pending", verified: false },
  { id: "RT-010", name: "Restaurant Name", address: "No 16, Fola Str, Lagos...", date: "24/12/25", addedBy: "John Doe", status: "Pending", verified: false },
];

export default function BukaManagement() {
  const [selectedRestaurants, setSelectedRestaurants] = useState<Set<string>>(new Set());

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRestaurants(new Set(MOCK_BUKAS.map((b) => b.id)));
    } else {
      setSelectedRestaurants(new Set());
    }
  };

  // Handle individual select
  const handleSelectRestaurant = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRestaurants);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRestaurants(newSelected);
  };

  const isAllSelected = MOCK_BUKAS.length > 0 && selectedRestaurants.size === MOCK_BUKAS.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 mt-8">
        
        {/* Main Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          {/* Top Utilities (Search & Actions) */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            {/* Search */}
            <div className="relative w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by email"
                className="w-full bg-gray-50 border-none rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-200"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 pr-2">
              {/* Date Picker using native input trick */}
              <div className="relative flex items-center">
                <input 
                  type="date" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onClick={(e) => {
                    try {
                      if ('showPicker' in HTMLInputElement.prototype) {
                        e.currentTarget.showPicker();
                      }
                    } catch (err) {}
                  }}
                />
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors pointer-events-none">
                  <Calendar size={16} />
                  Date
                </button>
              </div>
              
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_1.5fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-6 pt-4 pb-2 text-xs font-semibold text-[#1e293b] *:py-1 items-center bg-[#F8F9FA] border-b border-gray-100">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={isAllSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#fbbe15] focus:ring-[#fbbe15]" 
              />
            </div>
            <div>ID</div>
            <div>Restaurant Name</div>
            <div>Address</div>
            <div>Date Added</div>
            <div>Added By</div>
            <div>Status</div>
            <div className="flex justify-end pr-2 text-gray-400"><SlidersHorizontal size={16} /></div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col">
            {MOCK_BUKAS.map((buka, i) => (
              <div 
                key={i} 
                className={`grid grid-cols-[auto_1fr_1.5fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-6 items-center text-[13px] text-gray-600 border-b border-gray-50 hover:bg-gray-50 transition-colors py-[14px] ${selectedRestaurants.has(buka.id) ? 'bg-[#FCF7E8]/30' : ''}`}
              >
                {/* Checkbox */}
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={selectedRestaurants.has(buka.id)}
                    onChange={(e) => handleSelectRestaurant(buka.id, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#fbbe15] focus:ring-[#fbbe15]" 
                  />
                </div>
                
                <div className="font-medium text-gray-700">{buka.id}</div>
                
                {/* Restaurant Name with optional verification tick */}
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-600">{buka.name}</span>
                  {buka.verified && <MdVerified className="text-[#fbbe15]" size={14} />}
                </div>
                
                <div className="text-gray-500 truncate">{buka.address}</div>
                <div className="text-gray-500">{buka.date}</div>
                <div className="text-gray-500">{buka.addedBy}</div>
                <div>
                  <StatusBadge status={buka.status as BadgeStatus} />
                </div>
                
                {/* Action Column */}
                <div className="flex justify-end pr-2">
                  <Link 
                    href={`/secure-admin/buka-management/${buka.id}`}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Eye size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination currentPage={1} totalPages={10} />
        </div>
      </div>
    </div>
  );
}
