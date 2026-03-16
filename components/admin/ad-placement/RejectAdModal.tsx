"use client";

import { X } from "lucide-react";

export function RejectAdModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-zinc-900">Reject Ad</h3>
          <button onClick={onClose} className="p-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
            <X size={16} />
          </button>
        </div>
        
        <p className="text-sm text-zinc-500 mb-6">Are you sure you want to reject this ad?</p>
        
        <div className="space-y-2 mb-8">
           <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Reason for Rejection</label>
           <textarea 
             placeholder="Text"
             className="w-full h-24 p-4 rounded-xl border border-zinc-200 text-sm focus:ring-1 focus:ring-red-500 focus:outline-none resize-none placeholder:text-zinc-300"
           />
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-50 transition-colors"
          >
            No, Cancel
          </button>
          <button
          onClick={onClose} 
           className="flex-1 py-3 rounded-xl text-sm font-bold bg-[#fbbe15] text-zinc-900 hover:bg-[#eab308] transition-colors shadow-sm shadow-[#fbbe15]/20">
            Yes, Reject
          </button>
        </div>
      </div>
    </div>
  );
}