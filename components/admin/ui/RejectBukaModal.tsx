"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface RejectBukaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
  restaurantName: string;
}

export function RejectBukaModal({ isOpen, onClose, onReject, restaurantName }: RejectBukaModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleReject = () => {
    if (!reason.trim()) return;
    onReject(reason);
    setReason(""); // Reset for next use
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[24px] p-8 w-full max-w-[500px] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[28px] font-bold text-[#1f2937]">Reject {restaurantName}</h2>
          <button 
            onClick={onClose}
            className="w-7 h-7 bg-[#EF4444] rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <p className="text-[17px] text-[#4b5563] mb-6">
          Are you sure you want to reject this restaurant?
        </p>

        {/* Form Inputs */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[13px] font-medium text-gray-400">
              Reason for Rejection
            </label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-[#1f2937] rounded-xl px-4 py-3 text-gray-700 min-h-[100px] resize-none focus:outline-none focus:ring-1 focus:ring-primary text-[15px]" 
              placeholder="Provide a reason for the restaurant owner..."
              rows={4}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-4 items-center">
          <button 
            onClick={onClose}
            className="flex-1 py-4 text-[#0f172a] font-semibold text-[16px] hover:bg-gray-50 rounded-xl transition-colors"
          >
            No, Cancel
          </button>
          <button 
            onClick={handleReject}
            disabled={!reason.trim()}
            className="flex-1 py-4 bg-[#fbbe15] text-[#0f172a] font-semibold text-[16px] rounded-xl hover:bg-[#eab308] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Yes, Reject
          </button>
        </div>
      </div>
    </div>
  );
}
