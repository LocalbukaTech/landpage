'use client';

import { useState } from 'react';
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
  Building2,
  Send,
  Inbox,
  Copy,
  Check,
  PlusCircle,
} from 'lucide-react';
import {
  useContactsQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useReplyContactMutation,
  useIngestInboundEmailMutation,
} from '@/lib/api/services/contact.hooks';
import type {
  ContactInquiry,
  ContactStatus,
} from '@/lib/api/services/contact.service';
import { API_BASE_URL } from '@/lib/api/client';
import { Button } from '@/components/ui/button';

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
    'responses' | 'gmail-sync' | 'about'
  >('responses');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] =
    useState<ContactInquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replySuccessBanner, setReplySuccessBanner] = useState<string | null>(
    null
  );
  const [modalStatus, setModalStatus] = useState<ContactStatus>('pending');

  // Gmail manual/test forward state
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [inboundFrom, setInboundFrom] = useState('');
  const [inboundSubject, setInboundSubject] = useState('');
  const [inboundBody, setInboundBody] = useState('');
  const [inboundFeedback, setInboundFeedback] = useState<string | null>(null);

  const { data, isLoading, isError } = useContactsQuery({
    page,
    size: PAGE_SIZE,
    status: statusFilter,
  });
  const updateMutation = useUpdateContactMutation();
  const deleteMutation = useDeleteContactMutation();
  const replyMutation = useReplyContactMutation();
  const ingestMutation = useIngestInboundEmailMutation();

  const contactData = data?.data;
  const inquiries: ContactInquiry[] = [...(contactData?.docs ?? [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const totalPages = contactData?.total_pages ?? 1;
  const totalDocs = contactData?.total_docs ?? 0;

  const inboundWebhookUrl = `${API_BASE_URL}/contact/inbound-webhook`;

  const gmailAppsScriptCode = `// Google Apps Script: Auto-forward unread LocalBuka Gmail messages to Admin Panel
function syncLocalBukaGmailToAdmin() {
  var threads = GmailApp.search('is:unread to:me', 0, 20);
  var webhookUrl = '${inboundWebhookUrl}';
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    var msg = messages[messages.length - 1];
    if (msg.isUnread()) {
      UrlFetchApp.fetch(webhookUrl, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({
          from: msg.getFrom(),
          subject: msg.getSubject(),
          message: msg.getPlainBody()
        })
      });
      msg.markRead();
    }
  }
}`;

  const filteredInquiries = inquiries.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.phone && item.phone.includes(searchQuery)) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenInquiry = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.admin_notes || '');
    setReplyMessage('');
    setReplySuccessBanner(null);
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
          setReplySuccessBanner('Status and internal notes saved.');
        },
      }
    );
  };

  const handleSendDirectReply = () => {
    if (!selectedInquiry || !replyMessage.trim()) return;
    replyMutation.mutate(
      {
        id: selectedInquiry.id,
        data: {
          subject: `Re: ${selectedInquiry.subject} - LocalBuka Support`,
          replyMessage: replyMessage.trim(),
        },
      },
      {
        onSuccess: (res) => {
          const updated = res?.data?.data;
          setModalStatus('resolved');
          if (updated?.admin_notes) {
            setAdminNotes(updated.admin_notes);
          }
          setReplyMessage('');
          setReplySuccessBanner(
            `Reply sent to ${selectedInquiry.email} and inquiry marked as Resolved.`
          );
        },
      }
    );
  };

  const handleIngestEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inboundFrom.trim() || !inboundBody.trim()) return;
    ingestMutation.mutate(
      {
        from: inboundFrom.trim(),
        subject: inboundSubject.trim() || 'Direct Email to LocalBuka Gmail',
        message: inboundBody.trim(),
      },
      {
        onSuccess: () => {
          setInboundFrom('');
          setInboundSubject('');
          setInboundBody('');
          setInboundFeedback(
            'Email logged into Admin Contact inbox! Switch to "Contact & Gmail Inbox" to review.'
          );
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
    const rows = filteredInquiries.map((item) => [
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
            Contact Us, Gmail Inbox & About Us Admin
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Review and respond to user inquiries from the Contact Us page and emails sent to the LocalBuka Gmail
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#fbbe15] text-[#1a1a1a] px-4 py-2.5 rounded-lg font-bold text-sm">
            {totalDocs} Inquiries
          </div>
          {filteredInquiries.length > 0 && (
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Top View Switcher: Inbox vs Gmail Bridge vs About Us */}
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
          <span>Contact &amp; Gmail Inbox ({totalDocs})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('gmail-sync')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeMainTab === 'gmail-sync'
              ? 'bg-[#fbbe15] text-[#1a1a1a] shadow-xs'
              : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>LocalBuka Gmail Auto-Sync</span>
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

      {activeMainTab === 'gmail-sync' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Webhook & Auto-Forward Setup Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <Inbox className="w-5 h-5 text-[#fbbe15]" />
              <h2 className="text-base font-bold text-foreground">
                Route LocalBuka Gmail to Admin Panel
              </h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every inquiry submitted on <code className="text-[#fbbe15]">/contact</code> is automatically saved here AND emailed to the LocalBuka Gmail. To ensure emails sent <strong>directly</strong> to LocalBuka&apos;s Gmail also appear in this Admin Panel automatically, connect the Inbound Webhook below:
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Inbound Email Webhook Endpoint
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-mono text-foreground truncate">
                  {inboundWebhookUrl}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(inboundWebhookUrl);
                    setCopiedWebhook(true);
                    setTimeout(() => setCopiedWebhook(false), 2000);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#fbbe15] text-[#1a1a1a] font-bold text-xs cursor-pointer"
                >
                  {copiedWebhook ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy URL
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  1-Minute Gmail Auto-Forwarder (Google Apps Script)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(gmailAppsScriptCode);
                    setCopiedScript(true);
                    setTimeout(() => setCopiedScript(false), 2000);
                  }}
                  className="text-xs font-semibold text-[#fbbe15] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedScript ? 'Copied Script!' : 'Copy Script'}
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-gray-950 text-gray-200 text-[11px] font-mono overflow-x-auto leading-relaxed">
                {gmailAppsScriptCode}
              </pre>
              <p className="text-[11px] text-muted-foreground">
                Paste into <strong>script.google.com</strong> under the LocalBuka Gmail account and set a 5-minute time-driven trigger (or point Resend/Cloudflare Inbound Webhook to the URL above).
              </p>
            </div>
          </div>

          {/* Log / Test Inbound Gmail Inquiry */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <PlusCircle className="w-5 h-5 text-[#fbbe15]" />
              <h2 className="text-base font-bold text-foreground">
                Log or Test Inbound Gmail Message
              </h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Test the inbound Gmail webhook or manually log an external email so the admin team can track, add notes, and reply from the dashboard.
            </p>

            {inboundFeedback && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-medium">
                {inboundFeedback}
              </div>
            )}

            <form onSubmit={handleIngestEmail} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Sender Name &amp; Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chinedu Okafor <chinedu@gmail.com>"
                  value={inboundFrom}
                  onChange={(e) => setInboundFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question about listing my buka in Abuja"
                  value={inboundSubject}
                  onChange={(e) => setInboundSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Email Content
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Paste or type the email message sent to LocalBuka Gmail..."
                  value={inboundBody}
                  onChange={(e) => setInboundBody(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-foreground"
                />
              </div>

              <button
                type="submit"
                disabled={ingestMutation.isPending}
                className="w-full py-2.5 rounded-lg bg-[#fbbe15] hover:bg-[#e5ad13] text-[#1a1a1a] font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {ingestMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Inbox className="w-4 h-4" />
                )}
                <span>Send to Admin Contact Inbox</span>
              </button>
            </form>
          </div>
        </div>
      ) : activeMainTab === 'about' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-[#fbbe15]" />
              <h2 className="text-base font-bold text-foreground">
                About LocalBuka Overview
              </h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              LocalBuka is Africa&apos;s food discovery and community platform built for people who care deeply about where they eat, what they eat, and who they eat with.
            </p>
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Public About Page:</span>
                <a
                  href="/about"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#fbbe15] font-semibold hover:underline"
                >
                  /about ↗
                </a>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Public Contact Page:</span>
                <a
                  href="/contact"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#fbbe15] font-semibold hover:underline"
                >
                  /contact ↗
                </a>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Support &amp; Gmail Forward Target:</span>
                <span className="font-medium text-foreground">localbuka@gmail.com / support@localbuka.com</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Headquarters:</span>
                <span className="font-medium text-foreground">Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground">
              Inquiry Categories &amp; Routing
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All submissions from the public Contact Us form and inbound Gmail webhook are stored in PostgreSQL and trigger email notifications to the LocalBuka Gmail.
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                <span className="font-medium text-foreground">General Inquiry</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">subject: general</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                <span className="font-medium text-foreground">Restaurant Partnership</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">subject: restaurant</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                <span className="font-medium text-foreground">Inbound Gmail Message</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">subject: [Gmail] *</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          {/* Filter Bar */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, phone, subject, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-foreground text-xs focus:ring-2 focus:ring-[#fbbe15] focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(
                [
                  { label: 'All', value: undefined },
                  { label: 'Pending', value: 'pending' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Resolved', value: 'resolved' },
                  { label: 'Archived', value: 'archived' },
                ] as { label: string; value: ContactStatus | undefined }[]
              ).map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab.value);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    statusFilter === tab.value
                      ? 'bg-[#fbbe15] text-[#1a1a1a] font-bold'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[40vh]">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#fbbe15] mx-auto mb-3" />
                <p className="text-muted-foreground text-xs">
                  Loading user responses...
                </p>
              </div>
            </div>
          ) : isError ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-xs">
              Failed to load contact responses. Please check your connection and try again.
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
              <MessageSquareText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-semibold text-foreground mb-1">
                No contact responses found
              </h3>
              <p className="text-muted-foreground text-xs">
                {searchQuery
                  ? 'Try adjusting your search or filter criteria.'
                  : 'User responses submitted via Contact Us or forwarded from LocalBuka Gmail will appear here.'}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Sender
                      </th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Subject &amp; Message
                      </th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-5 py-3.5 text-right text-[11px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredInquiries.map((inquiry) => {
                      const statusMeta =
                        STATUS_CONFIG[inquiry.status] || STATUS_CONFIG.pending;
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
                          <td className="px-5 py-4 whitespace-nowrap">
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

              {/* Pagination */}
              <div className="px-5 py-3.5 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Page {page} of {totalPages} ({totalDocs} total inquiries)
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail & Direct Reply Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#fbbe15]">
                  {selectedInquiry.subject} Inquiry
                </span>
                <h2 className="text-lg font-bold text-foreground mt-0.5">
                  {selectedInquiry.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {selectedInquiry.email}
                  </a>
                  {selectedInquiry.phone && (
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="flex items-center gap-1 hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {selectedInquiry.phone}
                    </a>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {replySuccessBanner && (
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{replySuccessBanner}</span>
              </div>
            )}

            {/* User Message */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                User Message
              </label>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                {selectedInquiry.message}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Received on{' '}
                {new Date(selectedInquiry.created_at).toLocaleString()}
              </p>
            </div>

            {/* Direct In-App Email Reply Box */}
            <div className="space-y-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-[#fbbe15]" />
                  <span>Send Direct Reply to {selectedInquiry.email}</span>
                </label>
              </div>
              <textarea
                rows={3}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder={`Write your response to ${selectedInquiry.name}...`}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-foreground focus:ring-2 focus:ring-[#fbbe15] focus:border-transparent"
              />
              <div className="flex items-center justify-between pt-1">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(
                    selectedInquiry.subject
                  )} - LocalBuka Support`}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline"
                >
                  Or open in default mail app
                </a>
                <button
                  type="button"
                  onClick={handleSendDirectReply}
                  disabled={replyMutation.isPending || !replyMessage.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#fbbe15] hover:bg-[#e5ad13] text-[#1a1a1a] font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {replyMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Send Email &amp; Mark Resolved</span>
                </button>
              </div>
            </div>

            {/* Status Update */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Inquiry Status
              </label>
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
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Internal Admin Notes &amp; Reply Log
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes or record how this inquiry was resolved..."
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-foreground focus:ring-2 focus:ring-[#fbbe15] focus:border-transparent"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedInquiry(null)}
              >
                Close
              </Button>
              <button
                type="button"
                onClick={handleSaveInquiryUpdates}
                disabled={updateMutation.isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save Status &amp; Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
