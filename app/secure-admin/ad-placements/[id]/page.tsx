"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, X, Check } from "lucide-react";
import { RejectAdModal } from "@/components/admin/ad-placement/RejectAdModal";

export default function ViewAdPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params promise using React.use() to fix the Next.js error
  const resolvedParams = use(params);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  return (
    <div className="p-8 space-y-8 bg-white min-h-screen">
      {/* Breadcrumbs matching your design */}
      <nav className="flex items-center gap-2 text-[12px] text-zinc-400 font-medium">
        <Link href="/secure-admin/ad-placements" className="hover:text-zinc-600 transition-colors">
          Ad Placements
        </Link>
        <ChevronRight size={12} className="text-zinc-300" />
        <span className="text-zinc-900 font-semibold">View Ad Details</span>
      </nav>

      {/* User Details Section */}
      <section className="space-y-6">
        <h2 className="text-[14px] font-bold text-zinc-900">User Details</h2>
        <div className="flex items-start gap-8">
          {/* User Placeholder Icon in beige box */}
          <div className="w-20 h-20 bg-[#FFF9E5] rounded-xl flex items-center justify-center border border-zinc-50">
             <Image src="/images/profileIcon.png" alt="User" width={40} height={40} />
          </div>
          
          <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-[13px]">
            <p className="text-zinc-400">User ID:</p>
            <p className="font-bold text-zinc-900">{resolvedParams.id}</p>
            
            <p className="text-zinc-400">Name:</p>
            <p className="font-bold text-zinc-900">James Okoro</p>
            
            <p className="text-zinc-400">Email:</p>
            <p className="font-bold text-zinc-900">jamesokoro@gmail.com</p>
          </div>
        </div>
      </section>

      <div className="h-px bg-zinc-100 w-full" />

      {/* Ad Details Section */}
      <section className="space-y-6">
        <h2 className="text-[14px] font-bold text-zinc-900">Ad Details</h2>
        <div className="flex gap-10">
          {/* Ad Creative (Pizza Image) exactly as seen in your screenshot */}
          <div className="relative w-[220px] h-[280px] rounded-2xl overflow-hidden shadow-sm">
            <Image 
              src="/images/Food 2.png" 
              alt="Pizza Ad" 
              fill 
              className="object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-[11px] text-white flex items-center gap-1.5 font-medium">
               <span className="text-[8px]">▶</span> 3k
            </div>
          </div>

          {/* Ad Metadata Grid - Left Column Labels, Right Column Values */}
          <div className="flex-1 grid grid-cols-2 max-w-2xl text-[13px]">
            <div className="space-y-4 text-zinc-400">
              <p>Campaign Name:</p>
              <p>Description:</p>
              <p>Location:</p>
              <p>Budget:</p>
              <p>Amount (N):</p>
              <p>Starts:</p>
              <p>End:</p>
              <p>Total Ad Amount (N):</p>
              <p>Impressions:</p>
              <p>Reach:</p>
            </div>
            <div className="space-y-4 text-right font-bold text-zinc-900">
              <p>Pizza Go</p>
              <p className="font-normal text-zinc-500 text-left">Lorem ipsum dolor sit amet consectetur.</p>
              <p>Ikeja, Lagos, Lekki, Lagos</p>
              <p>Daily</p>
              <p>5,000</p>
              <p>12/11/2025 09:00AM</p>
              <p>13/11/2025 09:00AM</p>
              <p>35,000</p>
              <p>580</p>
              <p>234</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Buttons - Approve/Reject matching the design */}
      <div className="flex justify-end gap-3 pt-4">
        <button 
          onClick={() => setIsRejectModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-50 text-red-500 text-[13px] font-bold border border-red-100 hover:bg-red-100 transition-all"
        >
          <X size={16} strokeWidth={3} /> Reject
        </button>
        <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-50 text-green-600 text-[13px] font-bold border border-green-100 hover:bg-green-100 transition-all">
          <Check size={16} strokeWidth={3} /> Approve
        </button>
      </div>

      <RejectAdModal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} />
    </div>
  );
}