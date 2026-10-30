"use client";

import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteRestaurant } from "@/lib/api/services/restaurants.hooks";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface DeleteRestaurantModalProps {
  restaurantId: string | null;
  restaurantName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  redirectAfterDelete?: boolean;
}

export function DeleteRestaurantModal({
  restaurantId,
  restaurantName,
  isOpen,
  onClose,
  onSuccess,
  redirectAfterDelete = false,
}: DeleteRestaurantModalProps) {
  const { toast } = useToast();
  const router = useRouter();
  const deleteMutation = useDeleteRestaurant();

  if (!isOpen || !restaurantId) return null;

  const handleDelete = () => {
    deleteMutation.mutate(restaurantId, {
      onSuccess: () => {
        toast({
          title: "Restaurant deleted",
          description: `${restaurantName || "The restaurant"} has been permanently removed.`,
        });
        onSuccess?.();
        onClose();
        if (redirectAfterDelete) {
          router.push("/secure-admin/buka-management");
        }
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete restaurant.";
        toast({
          title: "Delete failed",
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
                Delete Restaurant Listing
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Permanent deletion action
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
          <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-start gap-2.5 text-xs text-red-800 dark:text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">
                Are you sure you want to delete {restaurantName ? `"${restaurantName}"` : "this restaurant"}?
              </p>
              <p className="mt-1.5 text-[11px] text-red-700/80 dark:text-red-400/80 leading-relaxed">
                This action is <strong>irreversible</strong>. The restaurant profile, photos, reviews, and associated listings will be completely purged from LocalBuka.
              </p>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  Permanently Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
