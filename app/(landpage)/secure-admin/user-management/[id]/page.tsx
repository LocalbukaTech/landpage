"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight, Ban, AlertCircle, Play, User, CheckCircle, Loader2 } from "lucide-react";
import { AdminTabs } from "@/components/admin/ui/AdminTabs";
import { SuspendAccountModal } from "@/components/admin/ui/SuspendAccountModal";
import { BanUserModal } from "@/components/admin/ui/BanUserModal";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useFlagUser } from "@/lib/api/services/users.hooks";
import { useToast } from "@/hooks/use-toast";

export default function UserDetails() {
  const [activeTab, setActiveTab] = useState("User Details");
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  // Extract ID from path
  const userIdSegment = pathname?.split("/").pop();
  const displayId = userIdSegment || "";

  // API Hooks
  const { data: userResp, isLoading } = useUser(displayId);
  const { mutateAsync: flagUserAsync, isPending: isFlagging } = useFlagUser();
  
  const user = userResp?.data;

  const handleFlagAction = async (status: string, reason: string) => {
    if (!user) return;
    try {
      await flagUserAsync({ id: user.id, reason, status });
      toast({
        title: "Success",
        description: `User successfully marked as ${status}`
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message || `Failed to mark user as ${status}`,
        variant: "destructive"
      });
      throw e; // re-throw for modal to catch if needed
    }
  };

  // Tab Content Renderers
  const renderUserDetails = () => {
    if (isLoading) {
       return <div className="p-8 text-center text-gray-500">Loading user details...</div>;
    }
    if (!user) {
       return <div className="p-8 text-center text-red-500">User not found</div>;
    }

    return (
    <div className="flex flex-col max-w-5xl mt-8">
      {/* Avatar Container */}
      <div className="w-24 h-24 bg-[#FCF7E8] rounded-xl flex items-center justify-center mb-10 border border-yellow-100">
        <User size={40} className="text-[#a18228]" strokeWidth={1.5} />
      </div>

      {/* Details List */}
      <div className="flex flex-col space-y-5">
        {[
          { label: "User ID", value: user.id },
          { label: "Full Name", value: user.fullName || "-" },
          { label: "Location", value: user.location || "-" },
          { label: "Email Address", value: user.email },
          { label: "Status", value: user.status },
          { label: "Joined", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-" },
        ].map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-[15px]">
            <span className="text-gray-500">{item.label}</span>
            <span className="font-semibold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
  };

  const renderContent = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
      {/* Dummy items matching the design grid */}
      {[
        { views: "3k" }, { views: "1.2k" }, { views: "5k" }, { views: "1.2k" }, { views: "40M" },
        { views: "282k" }, { views: "40M" }, { views: "282k" }, { views: "894k" }, { views: "746k" }
      ].map((item, i) => (
        <div key={i} className="relative aspect-3/4 rounded-xl overflow-hidden bg-gray-200">
          <Image 
            src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`} 
            alt="Food content" 
            fill
            className="object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          
          {/* View Count */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm font-semibold drop-shadow-md">
            <Play size={14} fill="currentColor" />
            {item.views}
          </div>
        </div>
      ))}
    </div>
  );

  const renderReportHistory = () => (
    <div className="flex flex-col mt-8 divide-y divide-gray-100">
      {[
        { title: "This account was reported", sub: "Abusive Behavior", date: "4 May, 2025 11:05AM" },
        { title: "This user reported account (ID: B1234)", sub: "Spamming", date: "4 May, 2025 11:05AM" },
        { title: "This user reported account (ID: B1234)", sub: "Spamming", date: "4 May, 2025 11:05AM" },
        { title: "This account was reported", sub: "Abusive Behavior", date: "4 May, 2025 11:05AM" },
      ].map((item, i) => (
        <div key={i} className="flex justify-between py-5 first:pt-0">
          <div className="flex flex-col gap-1">
            <span className="text-[14px] font-bold text-gray-800">{item.title}</span>
            <span className="text-[13px] text-gray-500">{item.sub}</span>
          </div>
          <span className="text-[13px] text-gray-400 font-medium">{item.date}</span>
        </div>
      ))}
    </div>
  );

  const renderLoginLog = () => (
    <div className="flex flex-col mt-8 divide-y divide-gray-100">
      {[
        { event: "Security Login", date: "4 May, 2025 11:05AM" },
        { event: "Security Logout", date: "4 May, 2025 11:05AM" },
        { event: "Security Login", date: "4 May, 2025 11:05AM" },
        { event: "Password Change", date: "4 May, 2025 11:05AM" },
      ].map((item, i) => (
        <div key={i} className="flex justify-between items-center py-5 first:pt-0">
          <span className="text-[14px] font-bold text-gray-800">{item.event}</span>
          <span className="text-[13px] text-gray-400 font-medium">{item.date}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/secure-admin/user-management" className="flex items-center gap-1 hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} />
          User Accounts
        </Link>
        <ChevronRight size={14} className="text-gray-400" />
        <span className="font-semibold text-gray-900">{isLoading ? "Loading..." : (user?.fullName || displayId)}</span>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-8 min-h-[600px]">
        
        {/* Title */}
        <h1 className="text-[22px] font-bold text-[#0F172A] mb-8">View User</h1>

        {/* Action Header Container */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-end border-b border-gray-100 gap-4 lg:gap-0">
          
          {/* Custom Tabs */}
          <div className="-mb-px">
            <AdminTabs 
              tabs={["User Details", "Content", "Report History", "Login/Activity Log"]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pb-3 lg:pb-4 pr-1">
            {user?.status === "Suspended" || user?.status === "Banned" ? (
              <button 
                onClick={() => handleFlagAction("Active", "Reactivated by Admin")}
                disabled={isFlagging}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                {isFlagging ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                Reactivate Account
              </button>
            ) : null}

            <button 
              onClick={() => setIsSuspendModalOpen(true)}
              disabled={user?.status === "Suspended" || isFlagging}
              className={`flex items-center gap-1.5 px-4 py-2 transition-colors rounded-lg text-sm font-semibold ${
                user?.status === "Suspended"
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-[#FCF7E8] text-[#D39B0A] hover:bg-[#f5ebd0]"
              }`}
            >
              <AlertCircle size={16} />
              {user?.status === "Suspended" ? "Suspended" : "Suspend Account"}
            </button>

            <button 
              onClick={() => setIsBanModalOpen(true)}
              disabled={user?.status === "Banned" || isFlagging}
              className={`flex items-center gap-1.5 px-4 py-2 transition-colors rounded-lg text-sm font-semibold ${
                user?.status === "Banned"
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-[#FEF2F2] text-[#EF4444] hover:bg-[#fee2e2]"
              }`}
            >
              <Ban size={16} />
              {user?.status === "Banned" ? "Banned" : "Ban User"}
            </button>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="mt-2">
          {activeTab === "User Details" && renderUserDetails()}
          {activeTab === "Content" && renderContent()}
          {activeTab === "Report History" && renderReportHistory()}
          {activeTab === "Login/Activity Log" && renderLoginLog()}
        </div>

      </div>

      <SuspendAccountModal 
        isOpen={isSuspendModalOpen} 
        onClose={() => setIsSuspendModalOpen(false)} 
        onSuspend={async (reason) => {
          await handleFlagAction("Suspended", reason);
          setIsSuspendModalOpen(false);
        }}
        isLoading={isFlagging}
      />

      <BanUserModal 
        isOpen={isBanModalOpen} 
        onClose={() => setIsBanModalOpen(false)} 
        onBan={async (reason) => {
          await handleFlagAction("Banned", reason);
          setIsBanModalOpen(false);
        }}
        isLoading={isFlagging}
      />
    </div>
  );
}
