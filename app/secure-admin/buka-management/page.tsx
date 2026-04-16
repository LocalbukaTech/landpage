"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Calendar, SlidersHorizontal, Eye, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Pagination } from "@/components/admin/ui/Pagination";
import { MdVerified } from "react-icons/md";
import { useRestaurants } from "@/lib/api/services/restaurants.hooks";
import { format } from "date-fns";

export default function BukaManagement() {
  const [selectedRestaurants, setSelectedRestaurants] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  // Reverted to use standard list only as /search endpoint is not functional
  const { data, isLoading, isFetching } = useRestaurants({
    page,
    pageSize: 10,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const restaurants = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRestaurants(new Set(restaurants.map((b) => b.id || '')));
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

  const isAllSelected = restaurants.length > 0 && selectedRestaurants.size === restaurants.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 mt-8">
        
        {/* Main Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col min-h-[600px]">
          {/* Top Utilities (Search & Actions) */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white rounded-t-xl z-20">
            {/* Search (Disabled per request) */}
            <div className="relative w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                placeholder="Search disabled..."
                disabled
                className="w-full bg-gray-50 border-none rounded-xl pl-11 pr-4 py-3 text-sm text-gray-400 cursor-not-allowed opacity-60"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 pr-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 uppercase font-bold tracking-tight">Status:</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="text-sm bg-transparent border-none focus:ring-0 text-gray-500 font-semibold cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Active</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Date Picker */}
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
                <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors pointer-events-none">
                  <Calendar size={16} />
                  Date
                </button>
              </div>
              
              <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_1.5fr_1.5fr_1.5fr_1.5fr_1fr_auto] gap-4 px-6 pt-4 pb-2 text-xs font-bold uppercase tracking-wider text-gray-400 items-center bg-[#F8F9FA] border-b border-gray-100">
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
            <div>Added By / Email</div>
            <div>Status</div>
            <div className="flex justify-end pr-2"><SlidersHorizontal size={16} className="text-gray-300" /></div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col flex-grow relative">
             {(isLoading || isFetching) && (
              <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-10 backdrop-blur-[1px]">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-[#fbbe15] w-8 h-8" />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Loading...</span>
                </div>
              </div>
            )}
            
            {!isLoading && restaurants.length === 0 && (
              <div className="flex flex-col justify-center items-center flex-grow text-gray-300 gap-3 py-20">
                <Search size={48} strokeWidth={1} />
                <p className="text-sm font-medium uppercase tracking-widest">No restaurants found</p>
              </div>
            )}

            {restaurants.map((buka, i) => {
               const displayDate = buka.createdAt ? format(new Date(buka.createdAt), 'dd/MM/yy') : "N/A";
               const isGoogle = buka.source === 'google' || !buka.owner;
               const ownerBlock = buka.owner ? (
                 <div className="flex flex-col truncate leading-tight">
                   <span className="font-semibold text-gray-800 truncate">{buka.owner.firstName} {buka.owner.lastName}</span>
                   <span className="text-[11px] text-gray-400 truncate mt-0.5">{buka.owner.email}</span>
                 </div>
               ) : (
                 <div className="flex flex-col truncate leading-tight italic text-gray-400">
                    <span className="text-xs font-medium tracking-wide uppercase">{isGoogle ? "Google Import" : "System Account"}</span>
                 </div>
               );

               return (
              <div 
                key={buka.id || i} 
                className={`grid grid-cols-[auto_1fr_1.5fr_1.5fr_1.5fr_1.5fr_1fr_auto] gap-4 px-6 items-center text-[13px] text-gray-600 border-b border-gray-50 hover:bg-[#F8F9FA] transition-all py-[14px] ${buka.id && selectedRestaurants.has(buka.id) ? 'bg-[#FCF7E8]/30' : ''}`}
              >
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={buka.id ? selectedRestaurants.has(buka.id) : false}
                    onChange={(e) => buka.id && handleSelectRestaurant(buka.id, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#fbbe15] focus:ring-[#fbbe15]" 
                  />
                </div>
                
                <div className="font-mono text-[11px] text-gray-400 uppercase" title={buka.id || ''}>{buka.id?.slice(0, 8)}</div>
                
                <div className="flex items-center gap-1.5 truncate" title={buka.name}>
                  <span className="text-gray-800 font-bold truncate">{buka.name}</span>
                  {buka.source === 'google' && <MdVerified className="text-[#fbbe15] shrink-0" size={14} title="Verified Source" />}
                </div>
                
                <div className="text-gray-500 truncate text-[12px]" title={buka.address}>{buka.address}</div>
                <div className="text-gray-500 font-medium">{displayDate}</div>
                
                <div className="text-gray-500 truncate">{ownerBlock}</div>
                
                <div>
                  <StatusBadge status={buka.status || 'pending'} />
                </div>
                
                <div className="flex justify-end pr-2">
                  {buka.id && (
                    <Link 
                      href={`/secure-admin/buka-management/${buka.id}`}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-white hover:text-[#fbbe15] hover:shadow-sm transition-all"
                    >
                      <Eye size={18} />
                    </Link>
                  )}
                </div>
              </div>
            )})}
          </div>

          {/* Pagination Footer - Always visible as requested */}
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          
        </div>
      </div>
    </div>
  );
}
