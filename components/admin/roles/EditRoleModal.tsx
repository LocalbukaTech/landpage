"use client";

import { useState } from "react";
import { X, Shield, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { useUpdateAdminRole } from "@/lib/api/services/moderation.hooks";
import type { AdminRole, AdminStaffMember } from "@/lib/api/services/moderation.service";
import { useToast } from "@/hooks/use-toast";

interface EditRoleModalProps {
  admin: AdminStaffMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditRoleModal({
  admin,
  isOpen,
  onClose,
  onSuccess,
}: EditRoleModalProps) {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<AdminRole>(
    admin?.role || "content_moderation"
  );

  const updateRoleMutation = useUpdateAdminRole();

  if (!isOpen || !admin) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateRoleMutation.mutate(
      { id: admin.id, role: selectedRole },
      {
        onSuccess: () => {
          toast({
            title: "Role updated",
            description: `Successfully updated ${admin.name}'s role to ${
              selectedRole === "super_admin" ? "Super Admin" : "Content Moderator"
            }.`,
          });
          onSuccess?.();
          onClose();
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || err?.message || "Failed to update admin role.";
          toast({
            title: "Update failed",
            description: msg,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/80 dark:bg-gray-850/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-[#9e7400] dark:text-[#fbbe15] flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Modify Admin Role
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Update permissions for {admin.name}
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700/80">
            <div className="text-xs font-bold text-gray-900 dark:text-white">
              {admin.name}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              {admin.email}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select New Permission Level:
            </label>
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setSelectedRole("content_moderation")}
                className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                  selectedRole === "content_moderation"
                    ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 ring-2 ring-[#fbbe15]"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900 dark:text-white">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    Content Moderator (`content_moderation`)
                  </div>
                  {selectedRole === "content_moderation" && (
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Can access moderation queue, review reported posts/users, and issue warnings, suspensions, or bans.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("super_admin")}
                className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                  selectedRole === "super_admin"
                    ? "bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 ring-2 ring-purple-500"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900 dark:text-white">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    Super Administrator (`super_admin`)
                  </div>
                  {selectedRole === "super_admin" && (
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                  )}
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Full administrative authority including Audit Log & History inspection, adding admins, and updating roles.
                </p>
              </button>
            </div>
          </div>

          {/* Footer */}
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
              disabled={updateRoleMutation.isPending}
              className="px-5 py-2 text-xs font-bold text-white bg-gray-900 hover:bg-black dark:bg-[#fbbe15] dark:text-gray-950 dark:hover:bg-[#f5b300] rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              {updateRoleMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update Role"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
