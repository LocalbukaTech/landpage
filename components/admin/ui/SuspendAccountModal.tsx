import { X, Loader2 } from "lucide-react";
import { useState } from "react";

interface SuspendAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuspend: (reason: string) => void;
  isLoading?: boolean;
}

export function SuspendAccountModal({ isOpen, onClose, onSuspend, isLoading }: SuspendAccountModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[24px] p-8 w-full max-w-[500px] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[28px] font-bold text-[#1f2937]">Suspend Account</h2>
          <button 
            onClick={onClose}
            className="w-7 h-7 bg-[#EF4444] rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <p className="text-[17px] text-[#4b5563] mb-6">
          Are you sure you want to suspend this account?
        </p>

        {/* Form Inputs */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[13px] font-medium text-gray-400">
              Reason for Suspension
            </label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-700 min-h-[60px] resize-none focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-200 text-[15px]" 
              placeholder="Text"
              rows={2}
            />
          </div>

          <div className="relative">
            <select className="w-full border border-[#1f2937] rounded-xl px-4 py-4 text-[#1f2937] appearance-none focus:outline-none focus:ring-1 bg-white text-[15px] font-medium font-sans">
              <option value="">Duration</option>
              <option value="1_day">1 Day</option>
              <option value="1_week">1 Week</option>
              <option value="1_month">1 Month</option>
              <option value="permanent">Permanent</option>
            </select>
            {/* Custom dropdown arrow to match the design style */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#1f2937]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
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
            onClick={() => onSuspend(reason)}
            disabled={isLoading}
            className="flex-1 py-4 bg-[#fbbe15] text-[#0f172a] font-semibold text-[16px] rounded-xl hover:bg-[#eab308] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            Yes, Suspend
          </button>
        </div>
      </div>
    </div>
  );
}
