'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Eye,
  Loader2,
  X,
  CheckCircle,
  PauseCircle,
  XCircle,
  Utensils,
  RefreshCw,
} from 'lucide-react';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { Pagination } from '@/components/admin/ui/Pagination';
import { MdVerified } from 'react-icons/md';
import {
  useRestaurants,
  useUpdateRestaurantStatus,
  useDeleteRestaurant,
} from '@/lib/api/services/restaurants.hooks';
import type { Restaurant } from '@/lib/api/services/restaurants.service';
import { format } from 'date-fns';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { DeleteRestaurantModal } from '@/components/admin/buka-management/DeleteRestaurantModal';
import { SuspendRestaurantModal } from '@/components/admin/buka-management/SuspendRestaurantModal';
import { RejectRestaurantModal } from '@/components/admin/buka-management/RejectRestaurantModal';
import { BulkRestaurantActionBar } from '@/components/admin/buka-management/BulkRestaurantActionBar';
import { QuickActionsDropdown } from '@/components/admin/buka-management/QuickActionsDropdown';
import { useToast } from '@/hooks/use-toast';

const PAGE_SIZE = 10;

export default function BukaManagement() {
  const { toast } = useToast();
  const [selectedRestaurants, setSelectedRestaurants] = useState<Set<string>>(
    new Set()
  );
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [deletingRestaurant, setDeletingRestaurant] = useState<Restaurant | null>(
    null
  );
  const [suspendingRestaurant, setSuspendingRestaurant] = useState<Restaurant | null>(
    null
  );
  const [rejectingRestaurant, setRejectingRestaurant] = useState<Restaurant | null>(
    null
  );
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  // Mutations
  const updateStatusMutation = useUpdateRestaurantStatus();
  const deleteMutation = useDeleteRestaurant();

  // Fetch restaurants
  const { data, isLoading, isFetching, refetch } = useRestaurants({
    page: 1,
    pageSize: 500,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const allRestaurants: Restaurant[] = useMemo(() => data?.data || [], [data?.data]);

  // Client-side search & filtering
  const filteredRestaurants = useMemo(() => {
    let result = [...allRestaurants];
    const query = searchTerm.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (buka) =>
          buka.name?.toLowerCase().includes(query) ||
          buka.address?.toLowerCase().includes(query) ||
          buka.cuisine?.toLowerCase().includes(query) ||
          (buka.owner &&
            `${buka.owner.firstName} ${buka.owner.lastName}`
              .toLowerCase()
              .includes(query)) ||
          buka.owner?.email?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((buka) => buka.status === statusFilter);
    }

    return result;
  }, [allRestaurants, searchTerm, statusFilter]);

  // Status counts
  const counts = useMemo(() => {
    const list = data?.data || [];
    return {
      all: list.length,
      approved: list.filter((b) => b.status === 'approved').length,
      pending: list.filter((b) => b.status === 'pending' || !b.status).length,
      suspended: list.filter((b) => b.status === 'suspended').length,
      rejected: list.filter((b) => b.status === 'rejected').length,
    };
  }, [data?.data]);

  const totalPages = Math.max(1, Math.ceil(filteredRestaurants.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  // Current page slice
  const restaurants = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRestaurants.slice(start, start + PAGE_SIZE);
  }, [filteredRestaurants, currentPage]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRestaurants(
        new Set(restaurants.map((b) => b.id).filter(Boolean) as string[])
      );
    } else {
      setSelectedRestaurants(new Set());
    }
  };

  const handleSelectRestaurant = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRestaurants);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRestaurants(newSelected);
  };

  const isAllSelected =
    restaurants.length > 0 &&
    restaurants.every((b) => b.id && selectedRestaurants.has(b.id));

  // Single Quick Status Action
  const handleQuickStatusChange = (restaurant: Restaurant, newStatus: string) => {
    if (!restaurant.id) return;
    updateStatusMutation.mutate(
      {
        id: restaurant.id,
        data: { status: newStatus, reason: `Quick action: changed to ${newStatus}` },
      },
      {
        onSuccess: () => {
          toast({
            title: `Restaurant ${newStatus}`,
            description: `Successfully updated ${restaurant.name} to ${newStatus}.`,
          });
          refetch();
        },
        onError: (err: any) => {
          toast({
            title: 'Action failed',
            description: err?.response?.data?.message || 'Could not update restaurant.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  // Bulk Actions
  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedRestaurants.size === 0) return;
    setIsBulkLoading(true);
    const ids = Array.from(selectedRestaurants);

    try {
      await Promise.all(
        ids.map((id) =>
          updateStatusMutation.mutateAsync({
            id,
            data: { status: newStatus, reason: `Bulk action: ${newStatus}` },
          })
        )
      );
      toast({
        title: 'Bulk update successful',
        description: `Updated ${ids.length} restaurants to ${newStatus}.`,
      });
      setSelectedRestaurants(new Set());
      refetch();
    } catch {
      toast({
        title: 'Bulk update error',
        description: 'Some restaurants could not be updated.',
        variant: 'destructive',
      });
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRestaurants.size === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${selectedRestaurants.size} selected restaurants?`
      )
    ) {
      return;
    }

    setIsBulkLoading(true);
    const ids = Array.from(selectedRestaurants);

    try {
      await Promise.all(ids.map((id) => deleteMutation.mutateAsync(id)));
      toast({
        title: 'Bulk delete successful',
        description: `Removed ${ids.length} restaurants.`,
      });
      setSelectedRestaurants(new Set());
      refetch();
    } catch {
      toast({
        title: 'Bulk delete error',
        description: 'Some restaurants could not be deleted.',
        variant: 'destructive',
      });
    } finally {
      setIsBulkLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs mt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#fbbe15]/20 text-gray-950 dark:text-[#fbbe15] flex items-center justify-center font-bold">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Restaurant & Buka Management
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Review restaurant submissions, manage active listings, approve, suspend, or delete restaurants.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 self-start sm:self-auto cursor-pointer"
          title="Refresh restaurant list"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-[#fbbe15]' : ''}`} />
        </button>
      </div>

      {/* Quick Status Filter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {[
          { id: 'all', label: 'All Listings', count: counts.all, color: 'text-gray-900 dark:text-white' },
          { id: 'approved', label: 'Approved (Live)', count: counts.approved, color: 'text-emerald-600 dark:text-emerald-400' },
          { id: 'pending', label: 'Pending Review', count: counts.pending, color: 'text-amber-600 dark:text-amber-400' },
          { id: 'suspended', label: 'Suspended (Hidden)', count: counts.suspended, color: 'text-orange-600 dark:text-orange-400' },
          { id: 'rejected', label: 'Rejected', count: counts.rejected, color: 'text-red-600 dark:text-red-400' },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
                setSelectedRestaurants(new Set());
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-gray-900 border-[#fbbe15] ring-2 ring-[#fbbe15]/20 shadow-xs'
                  : 'bg-white/60 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{tab.label}</span>
                <span className={`text-xs font-extrabold ${tab.color}`}>{tab.count}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs flex flex-col min-h-[550px] overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 gap-3 bg-gray-50/50 dark:bg-gray-850/40">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search by restaurant name, address, cuisine, or owner email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-8 py-2 text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fbbe15]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>
              Showing <strong>{filteredRestaurants.length}</strong> restaurants
            </span>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex flex-col grow relative overflow-x-auto">
          {(isLoading || isFetching) && (
            <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 flex items-center justify-center z-10 backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-[#fbbe15] w-7 h-7" />
                <span className="text-xs font-semibold text-gray-500">Loading restaurants...</span>
              </div>
            </div>
          )}

          {!isLoading && restaurants.length === 0 && (
            <div className="flex flex-col justify-center items-center grow text-gray-300 dark:text-gray-600 gap-3 py-20">
              <Utensils size={44} strokeWidth={1.5} className="text-gray-400" />
              <p className="text-xs font-medium text-gray-500">
                {searchTerm.trim() ? `No restaurants matching "${searchTerm.trim()}"` : 'No restaurants found in this category'}
              </p>
            </div>
          )}

          {restaurants.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
                  <TableHead className="w-1 p-0" />
                  <TableHead className="w-10 pl-3">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 accent-[#fbbe15] cursor-pointer"
                    />
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Restaurant
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Address & Location
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Owner
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Date Added
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right pr-5">
                    Admin Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {restaurants.map((buka, i) => {
                  const isSelected = buka.id ? selectedRestaurants.has(buka.id) : false;
                  const displayDate = buka.createdAt ? format(new Date(buka.createdAt), 'dd/MM/yyyy') : 'N/A';
                  const isApproved = buka.status === 'approved';
                  const isPending = buka.status === 'pending' || !buka.status;
                  const isSuspended = buka.status === 'suspended';

                  // Status bar color for left indicator
                  const statusBarColor = isApproved
                    ? 'bg-emerald-500'
                    : isPending
                      ? 'bg-amber-400'
                      : isSuspended
                        ? 'bg-orange-500'
                        : 'bg-red-500';

                  return (
                    <TableRow
                      key={buka.id || i}
                      data-state={isSelected ? 'selected' : undefined}
                      className={`border-b border-gray-100 dark:border-gray-800/80 text-xs transition-colors relative ${
                        isSelected
                          ? 'bg-amber-500/10 hover:bg-amber-500/15'
                          : 'hover:bg-gray-50/70 dark:hover:bg-gray-850/50'
                      }`}
                    >
                      {/* Status Color Indicator Bar */}
                      <TableCell className="w-1 p-0">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusBarColor} rounded-r-sm`} />
                      </TableCell>

                      {/* Checkbox */}
                      <TableCell className="pl-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => buka.id && handleSelectRestaurant(buka.id, e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 accent-[#fbbe15] cursor-pointer"
                        />
                      </TableCell>

                      {/* Restaurant Info */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-2 max-w-[220px]">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold text-gray-900 dark:text-white truncate">
                                {buka.name}
                              </span>
                              {buka.source === 'google' && (
                                <MdVerified className="text-[#fbbe15] shrink-0" size={14} title="Verified Source" />
                              )}
                            </div>
                            <span className="text-[11px] text-gray-400 capitalize truncate block">
                              {buka.cuisine || 'Cuisine'}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Address */}
                      <TableCell className="max-w-[200px] text-gray-500 dark:text-gray-400 text-xs truncate">
                        {buka.address}
                      </TableCell>

                      {/* Owner */}
                      <TableCell>
                        {buka.owner ? (
                          <div className="flex flex-col leading-tight">
                            <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[140px]">
                              {buka.owner.firstName} {buka.owner.lastName}
                            </span>
                            <span className="text-[10px] text-gray-400 truncate max-w-[140px]">
                              {buka.owner.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Unclaimed</span>
                        )}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {displayDate}
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell>
                        <StatusBadge status={buka.status || ''} />
                      </TableCell>

                      {/* High-Visibility Actions: Primary inline button + dropdown */}
                      <TableCell className="text-right pr-5 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* Primary context-aware action button */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleQuickStatusChange(buka, 'approved')}
                              disabled={updateStatusMutation.isPending}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                              title="Approve this pending restaurant"
                            >
                              <CheckCircle size={13} />
                              Approve
                            </button>
                          )}

                          {isApproved && (
                            <button
                              type="button"
                              onClick={() => setSuspendingRestaurant(buka)}
                              className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 font-bold text-[11px] inline-flex items-center gap-1.5 border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer"
                              title="Suspend this active restaurant"
                            >
                              <PauseCircle size={13} />
                              Suspend
                            </button>
                          )}

                          {isSuspended && (
                            <button
                              type="button"
                              onClick={() => handleQuickStatusChange(buka, 'approved')}
                              disabled={updateStatusMutation.isPending}
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] inline-flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-900 transition-colors cursor-pointer"
                              title="Reactivate this suspended restaurant"
                            >
                              <CheckCircle size={13} />
                              Reactivate
                            </button>
                          )}

                          {/* View Details */}
                          {buka.id && (
                            <Link
                              href={`/secure-admin/buka-management/${buka.id}`}
                              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                              title="View Full Details"
                            >
                              <Eye size={14} />
                            </Link>
                          )}

                          {/* More Actions Dropdown */}
                          <QuickActionsDropdown
                            restaurant={buka}
                            onApprove={(r) => handleQuickStatusChange(r, 'approved')}
                            onSuspend={(r) => setSuspendingRestaurant(r)}
                            onReject={(r) => setRejectingRestaurant(r)}
                            onDelete={(r) => setDeletingRestaurant(r)}
                            isUpdating={updateStatusMutation.isPending}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      <BulkRestaurantActionBar
        selectedCount={selectedRestaurants.size}
        onClear={() => setSelectedRestaurants(new Set())}
        onBulkApprove={() => handleBulkStatusChange('approved')}
        onBulkSuspend={() => handleBulkStatusChange('suspended')}
        onBulkDelete={handleBulkDelete}
        isLoading={isBulkLoading}
      />

      {/* Delete Modal */}
      {deletingRestaurant && (
        <DeleteRestaurantModal
          restaurantId={deletingRestaurant.id}
          restaurantName={deletingRestaurant.name}
          isOpen={!!deletingRestaurant}
          onClose={() => setDeletingRestaurant(null)}
          onSuccess={() => {
            refetch();
            setDeletingRestaurant(null);
          }}
        />
      )}

      {/* Suspend Modal */}
      {suspendingRestaurant && (
        <SuspendRestaurantModal
          restaurantId={suspendingRestaurant.id}
          restaurantName={suspendingRestaurant.name}
          isOpen={!!suspendingRestaurant}
          onClose={() => setSuspendingRestaurant(null)}
          onSuccess={() => {
            refetch();
            setSuspendingRestaurant(null);
          }}
        />
      )}

      {/* Reject Modal */}
      {rejectingRestaurant && (
        <RejectRestaurantModal
          restaurantId={rejectingRestaurant.id}
          restaurantName={rejectingRestaurant.name}
          isOpen={!!rejectingRestaurant}
          onClose={() => setRejectingRestaurant(null)}
          onSuccess={() => {
            refetch();
            setRejectingRestaurant(null);
          }}
        />
      )}
    </div>
  );
}
