"use client";

import { useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Search,
  X,
  Edit2,
  Trash2,
  Lock,
  RefreshCw,
} from "lucide-react";
import { getAdminUser } from "@/lib/auth";
import { useModerationStaff } from "@/lib/api/services/moderation.hooks";
import { CreateAdminModal } from "./CreateAdminModal";
import { EditRoleModal } from "./EditRoleModal";
import { DeleteAdminModal } from "./DeleteAdminModal";
import type { AdminStaffMember } from "@/lib/api/services/moderation.service";

export function RolesManagementPage() {
  const [currentAdmin] = useState(() => getAdminUser());
  const isSuperAdmin = currentAdmin?.role === "super_admin";

  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminStaffMember | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<AdminStaffMember | null>(null);

  const { data: staffResp, isLoading, isFetching, refetch } = useModerationStaff();
  const staffList: AdminStaffMember[] = (staffResp as any)?.data || staffResp || [];

  const filteredStaff = staffList.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (m.name || "").toLowerCase().includes(q) ||
      (m.email || "").toLowerCase().includes(q) ||
      (m.role || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Roles & Team Permissions
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Manage administrative access, content moderator privileges, and platform security.
              </p>
            </div>
          </div>
        </div>

        {/* Add Admin Button */}
        {isSuperAdmin && (
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#fbbe15] hover:bg-[#f5b300] text-gray-950 font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            Add New Admin
          </button>
        )}
      </div>

      {/* ── Role Definition Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Super Admin Card */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-purple-200 dark:border-purple-900/50 relative overflow-hidden shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Super Administrator (`super_admin`)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-[10px]">
              Full Access
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Has master authority over all platform operations, full Content Moderation execution, read-only Audit Log & History timeline, and team role administration.
          </p>
          <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              All Content Moderation actions & queue management
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              Moderation Audit Logs & History access
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              Add new admins and promote/modify staff roles
            </li>
          </ul>
        </div>

        {/* Content Moderation Card */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 relative overflow-hidden shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-[#9e7400] dark:text-[#fbbe15] flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Content Moderator (`content_moderation`)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-[#9e7400] dark:text-[#fbbe15] font-bold text-[10px]">
              Moderation Scope
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Dedicated to investigating reports, user inquiries, safety violations, and taking enforcement actions.
          </p>
          <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              View & filter Moderation Queue
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Review reports with evidence attachments & history
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Execute actions: Warn, Pause, Remove Post, Ban, Escalate
            </li>
          </ul>
        </div>
      </div>

      {/* ── Admin Staff Directory Table ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
        {/* Search & Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/70 dark:bg-gray-850/50">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Administrator Staff Directory
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold">
              {filteredStaff.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff by name or email..."
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#fbbe15]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              title="Refresh staff list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-[#fbbe15]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#fbbe15] mb-2" />
            Loading staff list...
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="p-12 text-center">
            <Lock className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              No administrators found
            </h3>
            <p className="text-xs text-gray-500">
              {search ? "No staff member matching your search query." : "No admin members registered yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3 px-4">
                    Staff Member
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Email
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Role & Permissions
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredStaff.map((staff) => {
                  const isSelf =
                    currentAdmin?.email?.toLowerCase() ===
                    staff.email?.toLowerCase();

                  return (
                    <tr
                      key={staff.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                            {staff.name?.[0]?.toUpperCase() || "A"}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {staff.name}
                            </span>
                            {isSelf && (
                              <span className="ml-2 px-1.5 py-0.5 rounded-sm bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 dark:text-gray-400 font-normal">
                                (You)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300 font-mono text-[11px]">
                        {staff.email}
                      </td>

                      <td className="py-3.5 px-4">
                        {staff.role === "super_admin" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            <ShieldCheck className="w-3 h-3 text-purple-600" />
                            Super Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <ShieldAlert className="w-3 h-3 text-amber-600" />
                            Content Moderator
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isSuperAdmin ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingAdmin(staff)}
                              className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3 text-gray-500" />
                              Change Role
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">
                            Protected
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Admin Modal */}
      {isCreateModalOpen && (
        <CreateAdminModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            refetch();
            setIsCreateModalOpen(false);
          }}
        />
      )}

      {/* Edit Role Modal */}
      {editingAdmin && (
        <EditRoleModal
          admin={editingAdmin}
          isOpen={!!editingAdmin}
          onClose={() => setEditingAdmin(null)}
          onSuccess={() => {
            refetch();
            setEditingAdmin(null);
          }}
        />
      )}

      {/* Delete Admin Modal */}
      {deletingAdmin && (
        <DeleteAdminModal
          admin={deletingAdmin}
          isOpen={!!deletingAdmin}
          onClose={() => setDeletingAdmin(null)}
          onSuccess={() => {
            refetch();
            setDeletingAdmin(null);
          }}
        />
      )}
    </div>
  );
}
