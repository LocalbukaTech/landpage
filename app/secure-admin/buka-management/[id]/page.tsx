"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Utensils, X, Check } from "lucide-react";
import { RejectBukaModal } from "@/components/admin/ui/RejectBukaModal";
import { usePathname } from "next/navigation";

export default function BukaDetails() {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const pathname = usePathname();
  
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
        <Link href="/secure-admin/buka-management" className="flex items-center gap-1 hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} />
          Buka Management
        </Link>
        <span className="text-gray-400">/</span>
        <span className="font-semibold text-[#1e293b]">Restaurant Name</span>
      </div>

      <h1 className="text-[24px] font-bold text-[#1e293b] mt-2 mb-2">Restaurant Name</h1>

      {/* Main Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Image Carousel */}
          <div className="w-full lg:w-[45%]">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100">
              <Image 
                src="/images/restaurantImage.png" 
                alt="Restaurant Interior"
                fill
                className="object-cover"
              />
              {/* Carousel Indicators (Mocked) */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
                <div className="w-2 h-2 rounded-full bg-white" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full lg:w-[55%] flex flex-col pt-2">
            
            {/* Header: Name & Tags */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Utensils size={24} className="text-[#1e293b]" strokeWidth={2.5} />
                <h2 className="text-[26px] font-bold text-[#1e293b]">Commint Buka</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#FCF7E8] text-[#D39B0A] text-xs font-semibold rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 border border-current rounded-full" />
                  Female Owned
                </span>
                <span className="px-3 py-1 bg-[#FCF7E8] text-[#D39B0A] text-xs font-semibold rounded-full">
                  Nigeria Cuisine
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2 text-[#4b5563] mb-6">
              <MapPin size={20} className="text-[#fbbe15] mt-0.5" />
              <span className="text-[17px]">15/17 Majekodunmi Street, Omotayo Street, Ikeja.</span>
            </div>

            {/* Ratings Badge */}
            <div className="bg-[#0f172a] rounded-xl p-4 flex items-center gap-6 mb-8 w-fit text-sm">
              <div className="flex items-center gap-1.5 text-white">
                <span className="text-[#fbbe15] font-bold">5.0</span>
                <span className="text-gray-300">Hygiene</span>
              </div>
              <div className="flex items-center gap-1.5 text-white">
                <span className="text-[#fbbe15] font-bold">3.0</span>
                <span className="text-gray-300">Affordability</span>
              </div>
              <div className="flex items-center gap-1.5 text-white">
                <span className="text-[#fbbe15] font-bold">4.5</span>
                <span className="text-gray-300">Food Quality</span>
              </div>
            </div>

            {/* Hours Table */}
            <div className="flex justify-start">
              <div className="text-[15px] font-semibold text-[#1e293b] mr-8 mt-1">Hours:</div>
              <div className="flex flex-col gap-3 text-[15px]">
                {[
                  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
                ].map((day) => (
                  <div key={day} className="flex gap-16">
                    <span className="text-gray-400 w-24">{day}</span>
                    <span className="text-[#1e293b] font-medium">9am-11pm</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Actions based on Image 2, 3, 4 matching layout */}
        <div className="flex justify-end mt-12 gap-4 border-t border-gray-100 pt-8">
          {status === "pending" && (
            <>
              <button 
                onClick={() => setIsRejectModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#FEF2F2] text-[#EF4444] hover:bg-[#fee2e2] transition-colors rounded-xl text-sm font-semibold"
              >
                <X size={16} strokeWidth={3} />
                Reject
              </button>
              <button 
                onClick={() => setStatus("approved")}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#F0FDF4] text-[#22C55E] hover:bg-[#dcfce7] transition-colors rounded-xl text-sm font-semibold"
              >
                <Check size={16} strokeWidth={3} />
                Approve
              </button>
            </>
          )}

          {status === "approved" && (
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#F0FDF4] text-[#22C55E] rounded-xl text-sm font-semibold cursor-default">
              <Check size={16} strokeWidth={3} />
              Approve for Delivery
            </button>
          )}

          {status === "rejected" && (
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#FEF2F2] text-[#EF4444] rounded-xl text-sm font-semibold cursor-default">
              <X size={16} strokeWidth={3} />
              Remove from Delivery
            </button>
          )}
        </div>

      </div>

      <RejectBukaModal 
        isOpen={isRejectModalOpen} 
        onClose={() => setIsRejectModalOpen(false)} 
        onReject={() => {
          setStatus("rejected");
          setIsRejectModalOpen(false);
        }} 
        restaurantName="Commint Buka"
      />
    </div>
  );
}
