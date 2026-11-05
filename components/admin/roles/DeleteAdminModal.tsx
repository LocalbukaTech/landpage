"use client";

import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteAdmin } from "@/lib/api/services/moderation.hooks";
import type { AdminStaffMember } from "@/lib/api/services/moderation.service";
import { useToast } from "@/hooks/use-toast";

interface DeleteAdminModalProps {
  admin: AdminStaffMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteAdminModal({
  admin,
  isOpen,
  onClose,
  onSuccess,
}: DeleteAdminModalProps) {
  const { toast } = useToast();
  const deleteAdminMutation = useDeleteAdmin();

  if (!isOpen || !admin) return null;

  const handleDelete = () => {
    deleteAdminMutation.mutate(admin.id, {
      onSuccess: () => {
        toast({
          title: "Admin removed",
          description: `Successfully removed ${admin.name} from the administrator staff list.`,
        });
        onSuccess?.();
        onClose();
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to remove admin member.";
        toast({
          title: "Removal failed",
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
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-red-50/60 dark:bg-red-950/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Remove Administrator
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Revoke platform administrative access
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

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-start gap-2.5 text-xs text-red-800 dark:text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              Are you sure you want to remove <strong>{admin.name}</strong> (
              <span className="font-mono">{admin.email}</span>)?
              <p className="mt-1 text-[11px] text-red-700/80 dark:text-red-400/80">
                They will immediately lose access to the admin dashboard, content
                moderation queue, and management tools.
              </p>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={deleteAdminMutation.isPending}
              className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteAdminMutation.isPending}
              className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              {deleteAdminMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  Confirm Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
