"use client";

import { useState } from "react";
import { X, UserPlus, Eye, EyeOff, Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import { useCreateAdmin } from "@/lib/api/services/moderation.hooks";
import type { AdminRole } from "@/lib/api/services/moderation.service";
import { useToast } from "@/hooks/use-toast";

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateAdminModal({ isOpen, onClose, onSuccess }: CreateAdminModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "content_moderation" as AdminRole,
  });
  const [showPassword, setShowPassword] = useState(false);

  const createAdminMutation = useCreateAdmin();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim() || !formData.password) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all the details for the new administrator.",
        variant: "destructive",
      });
      return;
    }

    createAdminMutation.mutate(formData, {
      onSuccess: () => {
        toast({
          title: "Admin created successfully",
          description: `${formData.first_name} ${formData.last_name} has been added as ${
            formData.role === "super_admin" ? "Super Admin" : "Content Moderator"
          }.`,
        });
        onSuccess?.();
        onClose();
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || err?.message || "Failed to create new admin member.";
        toast({
          title: "Failed to create admin",
          description: msg,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/80 dark:bg-gray-850/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-[#9e7400] dark:text-[#fbbe15] flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Add New Administrator
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Grant staff permissions to manage the platform
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="e.g. Aisha"
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#fbbe15]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="e.g. Kalu"
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#fbbe15]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Work Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. aisha.kalu@localbuka.com"
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#fbbe15]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Temporary Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Strong password with numbers & symbols"
                className="w-full px-3 py-2 pr-9 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#fbbe15]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Assigned Permission Role:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "content_moderation" })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formData.role === "content_moderation"
                    ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 ring-2 ring-[#fbbe15]"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900 dark:text-white mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  Moderator
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                  Access to moderation queue, report review, and taking enforcement actions.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "super_admin" })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formData.role === "super_admin"
                    ? "bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 ring-2 ring-purple-500"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900 dark:text-white mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  Super Admin
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                  Full unrestricted platform control, audit logs, and staff role management.
                </p>
              </button>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createAdminMutation.isPending}
              className="px-5 py-2 text-xs font-bold text-white bg-gray-900 hover:bg-black dark:bg-[#fbbe15] dark:text-gray-950 dark:hover:bg-[#f5b300] rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              {createAdminMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  Create Admin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
