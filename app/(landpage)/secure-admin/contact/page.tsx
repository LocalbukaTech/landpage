'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquareText,
  Mail,
  Phone,
  Search,
  Loader2,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
  X,
  Save,
  Info,
  Send,
} from 'lucide-react';
import {
  useContactsQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useBulkDeleteContactsMutation,
} from '@/lib/api/services/contact.hooks';
import type {
  ContactInquiry,
  ContactStatus,
} from '@/lib/api/services/contact.service';
import { Button } from '@/components/ui/button';
import { AboutUsContactEditor } from '@/components/admin/contact/AboutUsContactEditor';
import { BrandedEmailComposer } from '@/components/admin/contact/BrandedEmailComposer';

const PAGE_SIZE = 10;

const STATUS_CONFIG: Record<
  ContactStatus,
  { label: string; badgeClass: string }
> = {
  pending: {
    label: 'Pending',
    badgeClass:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800',
  },
  in_progress: {
    label: 'In Progress',
    badgeClass:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  },
  resolved: {
    label: 'Resolved',
    badgeClass:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',
  },
  archived: {
    label: 'Archived',
    badgeClass:
      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700',
  },
};

export default function AdminContactPage() {
  const [activeMainTab, setActiveMainTab] = useState<
    'responses' | 'branded-email' | 'about'
  >('responses');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedInquiry, setSelectedInquiry] =
    useState<ContactInquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusSaveBanner, setStatusSaveBanner] = useState<string | null>(null);
  const [modalStatus, setModalStatus] = useState<ContactStatus>('pending');

  // Debounce server-side search query so it searches across ALL pages cleanly
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isError } = useContactsQuery({
    page,
    size: PAGE_SIZE,
    status: statusFilter,
    q: debouncedSearch || undefined,
  });
  const updateMutation = useUpdateContactMutation();
  const deleteMutation = useDeleteContactMutation();
  const bulkDeleteMutation = useBulkDeleteContactsMutation();

  const contactData = data?.data;
  const inquiries: ContactInquiry[] = [...(contactData?.docs ?? [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const totalPages = contactData?.total_pages ?? 1;
  const totalDocs = contactData?.total_docs ?? 0;
  const unreadCount = contactData?.unread_count ?? 0;
  const statusCounts = contactData?.counts;

  const visibleIds = inquiries.map((i) => i.id);
  const activeSelectedIds = selectedIds.filter((id) => visibleIds.includes(id));
  const allVisibleSelected =
    visibleIds.length > 0 && activeSelectedIds.length === visibleIds.length;

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleIds);
    }
  };

  const handleBulkDelete = () => {
    if (activeSelectedIds.length === 0) return;
    if (
      !window.confirm(
        `Delete ${activeSelectedIds.length} selected ${
          activeSelectedIds.length === 1 ? 'inquiry' : 'inquiries'
        }? This cannot be undone.`
      )
    ) {
      return;
    }
    bulkDeleteMutation.mutate(activeSelectedIds, {
      onSuccess: () => {
        setSelectedIds([]);
        if (selectedInquiry && activeSelectedIds.includes(selectedInquiry.id)) {
          setSelectedInquiry(null);
        }
      },
    });
  };

  const handleOpenInquiry = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.admin_notes || '');
    setStatusSaveBanner(null);
    setModalStatus(inquiry.status);

    if (!inquiry.is_read) {
      updateMutation.mutate({
        id: inquiry.id,
        data: { is_read: true },
      });
    }
  };

  const handleSaveInquiryUpdates = () => {
    if (!selectedInquiry) return;
    updateMutation.mutate(
      {
        id: selectedInquiry.id,
        data: {
          status: modalStatus,
          admin_notes: adminNotes,
          is_read: true,
        },
      },
      {
        onSuccess: () => {
          setSelectedInquiry((prev) =>
            prev
              ? {
                  ...prev,
                  status: modalStatus,
                  admin_notes: adminNotes,
                  is_read: true,
                }
              : null
          );
          setStatusSaveBanner('Status and internal notes saved.');
        },
      }
    );
  };

  const handleDeleteInquiry = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) {
      return;
    }
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
      },
    });
  };

  const exportToCSV = () => {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Subject',
      'Status',
      'Message',
      'Date',
    ];
    const rows = inquiries.map((item) => [
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.email.replace(/"/g, '""')}"`,
      `"${(item.phone || '').replace(/"/g, '""')}"`,
      `"${item.subject.replace(/"/g, '""')}"`,
      item.status,
      `"${item.message.replace(/"/g, '""')}"`,
      new Date(item.created_at).toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-inquiries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            Contact Us, Branded Email &amp; About Us Admin
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Manage inquiries, reply using LocalBuka&apos;s branded customer email templates, and update live About Us &amp; Contact pages
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {unreadCount > 0 && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3.5 py-2 rounded-lg font-bold text-xs">
              {unreadCount} Unread
            </div>
          )}
          <div className="bg-[#fbbe15] text-[#1a1a1a] px-4 py-2.5 rounded-lg font-bold text-sm">
            {statusCounts?.all ?? totalDocs} Inquiries
          </div>
          {inquiries.length > 0 && activeMainTab === 'responses' && (
            <button
              type="button"
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Top View Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveMainTab('responses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeMainTab === 'responses'
              ? 'bg-[#fbbe15] text-[#1a1a1a] shadow-xs'
              : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <MessageSquareText className="w-4 h-4" />
          <span>Contact Inbox ({statusCounts?.all ?? totalDocs})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('branded-email')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeMainTab === 'branded-email'
              ? 'bg-[#fbbe15] text-[#1a1a1a] shadow-xs'
              : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Send Branded Email</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('about')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeMainTab === 'about'
              ? 'bg-[#fbbe15] text-[#1a1a1a] shadow-xs'
              : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>About Us &amp; Contact Info</span>
        </button>
      </div>

      {activeMainTab === 'branded-email' ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <BrandedEmailComposer mode="standalone" />
        </div>
      ) : activeMainTab === 'about' ? (
        <AboutUsContactEditor />
      ) : (
        <>
          {/* Search, Bulk Actions & Status Filter */}
          <search className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-3">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <label htmlFor="admin-inbox-search" className="sr-only">
                  Search all contact inquiries
                </label>
                <input
                  id="admin-inbox-search"
                  name="q"
                  type="search"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search all inquiries by name, email, phone, subject, or message..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs sm:text-sm text-foreground focus-visible:outline-2 focus-visible:outline-[#fbbe15]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { value: undefined, label: 'All', count: statusCounts?.all },
                    {
                      value: 'pending',
                      label: 'Pending',
                      count: statusCounts?.pending,
                    },
                    {
                      value: 'in_progress',
                      label: 'In Progress',
                      count: statusCounts?.in_progress,
                    },
                    {
                      value: 'resolved',
                      label: 'Resolved',
                      count: statusCounts?.resolved,
                    },
                    {
                      value: 'archived',
                      label: 'Archived',
                      count: statusCounts?.archived,
                    },
                  ] as {
                    value: ContactStatus | undefined;
                    label: string;
                    count?: number;
                  }[]
                ).map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setStatusFilter(item.value);
                      setSelectedIds([]);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      statusFilter === item.value
                        ? 'bg-[#fbbe15] text-[#1a1a1a] font-bold'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.label}
                    {typeof item.count === 'number' ? ` (${item.count})` : ''}
                  </button>
                ))}
              </div>
            </div>

            {activeSelectedIds.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs font-semibold text-foreground">
                  {activeSelectedIds.length}{' '}
                  {activeSelectedIds.length === 1 ? 'inquiry' : 'inquiries'}{' '}
                  selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedIds([])}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-medium text-foreground cursor-pointer"
                  >
                    Clear Selection
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    disabled={bulkDeleteMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {bulkDeleteMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>Delete Selected ({activeSelectedIds.length})</span>
                  </button>
                </div>
              </div>
            )}
          </search>

          {/* Table */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-xs">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-[#fbbe15]" />
                <p className="text-sm">Loading contact inquiries...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-20 px-4">
                <p className="text-red-500 font-medium text-sm">
                  Unable to load contact inquiries. Make sure you are signed in
                  as an administrator.
                </p>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-20 px-4 space-y-2">
                <MessageSquareText className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto" />
                <h3 className="text-base font-semibold text-foreground">
                  No contact inquiries found
                </h3>
                <p className="text-xs text-muted-foreground">
                  {debouncedSearch
                    ? `No results matched "${debouncedSearch}".`
                    : 'Messages submitted from the public Contact Us page will appear here.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 dark:bg-gray-800/70 border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="pl-5 pr-2 py-3.5 w-10">
                        <input
                          type="checkbox"
                          aria-label="Select all inquiries on this page"
                          checked={allVisibleSelected}
                          onChange={toggleSelectAllVisible}
                          className="h-4 w-4 accent-[#fbbe15] rounded cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3.5 text-[11px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Sender
                      </th>
                      <th className="px-5 py-3.5 text-[11px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Subject &amp; Message
                      </th>
                      <th className="px-5 py-3.5 text-[11px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3.5 text-[11px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-5 py-3.5 text-right text-[11px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {inquiries.map((inquiry) => {
                      const statusMeta =
                        STATUS_CONFIG[inquiry.status] || STATUS_CONFIG.pending;
                      const isChecked = activeSelectedIds.includes(inquiry.id);
                      return (
                        <tr
                          key={inquiry.id}
                          onClick={() => handleOpenInquiry(inquiry)}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors cursor-pointer ${
                            !inquiry.is_read
                              ? 'bg-yellow-50/40 dark:bg-yellow-950/10 font-medium'
                              : ''
                          }`}
                        >
                          <td
                            className="pl-5 pr-2 py-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              aria-label={`Select inquiry from ${inquiry.name}`}
                              checked={isChecked}
                              onChange={() => toggleSelectRow(inquiry.id)}
                              className="h-4 w-4 accent-[#fbbe15] rounded cursor-pointer"
                            />
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              {!inquiry.is_read && (
                                <span
                                  className="w-2 h-2 rounded-full bg-[#fbbe15] shrink-0"
                                  title="Unread"
                                />
                              )}
                              <div>
                                <div className="text-xs font-bold text-foreground">
                                  {inquiry.name}
                                </div>
                                <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Mail className="w-3 h-3" />
                                  <span>{inquiry.email}</span>
                                </div>
                                {inquiry.phone && (
                                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <Phone className="w-3 h-3" />
                                    <span>{inquiry.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 max-w-md">
                            <div className="text-xs font-semibold text-foreground capitalize mb-0.5">
                              {inquiry.subject.replace(/_/g, ' ')}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {inquiry.message}
                            </p>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusMeta.badgeClass}`}
                            >
                              {statusMeta.label}
                            </span>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap text-xs text-muted-foreground">
                            {new Date(inquiry.created_at).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                          </td>

                          <td
                            className="px-5 py-4 whitespace-nowrap text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenInquiry(inquiry)}
                                className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                title="View & Reply"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteInquiry(inquiry.id)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-200 dark:border-gray-800 text-xs text-muted-foreground">
                <span>
                  Page {page} of {totalPages} ({totalDocs} total)
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Detail & Branded Customer-Template Reply Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground capitalize">
                  {selectedInquiry.subject.replace(/_/g, ' ')} Inquiry
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  From <strong>{selectedInquiry.name}</strong> (
                  {selectedInquiry.email})
                  {selectedInquiry.phone ? ` · ${selectedInquiry.phone}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                aria-label="Close inquiry modal"
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusSaveBanner && (
              <div
                role="status"
                aria-live="polite"
                className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{statusSaveBanner}</span>
              </div>
            )}

            {/* User Original Message */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                User Message
              </span>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Branded Customer-Template Email Composer */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
              <BrandedEmailComposer
                key={selectedInquiry.id}
                mode="reply"
                inquiry={selectedInquiry}
                onReplySent={({ emailDelivered, updatedInquiry }) => {
                  if (emailDelivered) {
                    setModalStatus('resolved');
                  }
                  if (updatedInquiry?.admin_notes) {
                    setAdminNotes(updatedInquiry.admin_notes);
                  }
                }}
              />
            </div>

            {/* Status Update */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Inquiry Status
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    { value: 'pending', label: 'Pending', icon: Clock },
                    { value: 'in_progress', label: 'In Progress', icon: Clock },
                    {
                      value: 'resolved',
                      label: 'Resolved',
                      icon: CheckCircle2,
                    },
                    { value: 'archived', label: 'Archived', icon: Archive },
                  ] as { value: ContactStatus; label: string; icon: any }[]
                ).map((st) => {
                  const Icon = st.icon;
                  return (
                    <button
                      key={st.value}
                      type="button"
                      onClick={() => setModalStatus(st.value)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        modalStatus === st.value
                          ? 'bg-[#fbbe15] text-[#1a1a1a] border-[#fbbe15]'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="space-y-1.5">
              <label
                htmlFor="modal-admin-notes"
                className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block"
              >
                Internal Admin Notes &amp; Reply Log
              </label>
              <textarea
                id="modal-admin-notes"
                name="adminNotes"
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes or record how this inquiry was resolved..."
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-[#fbbe15]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveInquiryUpdates}
                disabled={updateMutation.isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#fbbe15] hover:bg-[#e5ad13] text-[#1a1a1a] font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save Status &amp; Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
