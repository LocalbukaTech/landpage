import { api } from '../client';
import type { ApiResponse } from '../types';

// ============================================
// Shared / Common Types
// ============================================

export type ModerationStatus = 'open' | 'escalated' | 'closed';
export type ModerationPriority = 'urgent' | 'standard';
export type ContentType = 'post' | 'profile';
export type AdminRole = 'super_admin' | 'content_moderation';

export type ModerationReason =
  | 'Harassment'
  | 'Pretending to be someone else'
  | 'Fake account or bot'
  | 'Scam or dishonest selling'
  | 'Scam or fraud'
  | 'Inappropriate Profile Content'
  | 'Inappropriate content'
  | 'Spam'
  | 'Fake listing'
  | 'Other';

export type ModerationAction =
  | 'ignore'
  | 'warn'
  | 'remove_post'
  | 'pause_account'
  | 'ban_account'
  | 'escalate';

export type PauseDuration =
  | '24 hours'
  | '48 hours'
  | '3 days'
  | '7 days'
  | '30 days';

export type ModerationDecision =
  | 'Ignored'
  | 'Warned user'
  | 'Removed post'
  | 'Paused account'
  | 'Banned account'
  | 'Escalated'
  | 'all';

export type AuditDateRange = 'all' | 'today' | '7d' | '30d';

// ============================================
// User Report Types
// ============================================

export interface SubmitReportPayload {
  targetType: 'post' | 'profile' | 'user';
  targetId: string;
  reason: ModerationReason;
  notes?: string;
  link?: string;
  proofImage?: string;
  isAnonymous?: boolean;
}

export interface SubmitReportResponse {
  message: string;
  reportNumber: string;
  status: ModerationStatus;
  priority: ModerationPriority;
}

// ============================================
// Admin Moderation Queue Types
// ============================================

export interface ModerationQueueItem {
  id: string;
  reportNumber: string;
  targetType: ContentType;
  targetId: string;
  title: string;
  targetHandle: string;
  targetLocation: string;
  avatar: string;
  reason: string;
  tags: string[];
  status: ModerationStatus;
  priority: ModerationPriority;
  urgentReason: string | null;
  createdAt: string;
  timeAgo: string;
}

export interface ModerationQueueFilters {
  search?: string;
  contentType?: 'post' | 'profile' | 'all';
  reason?: string;
  status?: ModerationStatus | 'all';
  priority?: ModerationPriority | 'all';
  page?: number;
  limit?: number;
}

export interface ModerationQueueCounts {
  open: number;
  escalated: number;
  closed: number;
  urgent: number;
}

export interface ModerationQueueResponse {
  items: ModerationQueueItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: ModerationQueueCounts;
}

// ============================================
// Admin Report Review Types
// ============================================

export interface AuditTrailEntry {
  id: string;
  action: string;
  title: string;
  details: string | null;
  createdAt: string;
  timeAgo: string;
}

export interface PreviousReport {
  id: string;
  reportNumber: string;
  reason: string;
  reportedBy: string;
  createdAt: string;
  timeAgo: string;
}

export interface ReportReviewResponse {
  report: {
    id: string;
    reportNumber: string;
    status: ModerationStatus;
    priority: ModerationPriority;
    urgentReason: string | null;
    createdAt: string;
    timeAgo: string;
  };
  reportedProfile: {
    id: string;
    userId: string;
    fullName: string;
    username: string;
    location: string;
    avatar: string;
    status: string;
    joinedDate: string;
    totalPosts: number;
  } | null;
  reportedPost: {
    id: string;
    caption: string;
    imageUrl: string | null;
    createdAt: string;
  } | null;
  reportDetails: {
    reason: string;
    tags: string[];
    submitted: string;
    reportedBy: string;
    notes: string | null;
    attachedProof: string | null;
    link: string | null;
  };
  previousReports: PreviousReport[];
  auditTrail: AuditTrailEntry[];
}

// ============================================
// Admin Action Types
// ============================================

export type ModerationActionPayload =
  | { action: 'ignore'; note?: string }
  | { action: 'warn'; warningMessage: string }
  | { action: 'remove_post'; note?: string }
  | { action: 'pause_account'; duration: PauseDuration; note?: string }
  | { action: 'ban_account'; note?: string }
  | { action: 'escalate'; escalationNote: string };

export interface ModerationActionResponse {
  message: string;
  reportId: string;
  reportNumber: string;
  status: ModerationStatus;
  decision: string;
}

// ============================================
// Audit Log Types
// ============================================

export interface AuditLogFilters {
  search?: string;
  staffId?: string;
  decision?: ModerationDecision;
  dateRange?: AuditDateRange;
  page?: number;
  limit?: number;
}

export interface AuditLogItem {
  id: string;
  reportNumber: string;
  type: string;
  reason: string;
  decision: string;
  decisionNote: string | null;
  decisionDuration: string | null;
  handledBy: string;
  handledById: string;
  closed: string;
  closedAt: string;
  timeline: AuditTrailEntry[];
}

export interface AuditLogResponse {
  items: AuditLogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// Admin Staff Types
// ============================================

export interface AdminStaffMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

// ============================================
// Admin Management Types
// ============================================

export interface CreateAdminPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: AdminRole;
}

export interface AdminMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: AdminRole;
  created_at: string;
  updated_at: string;
}

export interface CreateAdminResponse {
  token: string;
  admin: AdminMember;
}

// ============================================
// Service
// ============================================

export const moderationService = {
  // ── User-facing: Submit a report ──────────────────────────────────
  submitReport: (data: SubmitReportPayload | FormData) =>
    api.post<ApiResponse<SubmitReportResponse>>(
      '/reports',
      data,
      data instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined,
    ),

  submitPostReport: (postId: string, data: Pick<SubmitReportPayload, 'reason' | 'notes' | 'link' | 'isAnonymous'>) =>
    api.post<ApiResponse<SubmitReportResponse>>(`/reports/post/${postId}`, data),

  submitUserReport: (userId: string, data: Pick<SubmitReportPayload, 'reason' | 'notes' | 'link' | 'isAnonymous'>) =>
    api.post<ApiResponse<SubmitReportResponse>>(`/reports/user/${userId}`, data),

  // ── Admin: Moderation Queue ────────────────────────────────────────
  getQueue: (filters?: ModerationQueueFilters) =>
    api.get<ApiResponse<ModerationQueueResponse>>('/admin/moderation/reports', {
      params: filters,
    }),

  // ── Admin: Report Review ───────────────────────────────────────────
  getReport: (id: string) =>
    api.get<ApiResponse<ReportReviewResponse>>(`/admin/moderation/reports/${id}`),

  // ── Admin: Execute Action ──────────────────────────────────────────
  takeAction: (id: string, payload: ModerationActionPayload) =>
    api.post<ApiResponse<ModerationActionResponse>>(
      `/admin/moderation/reports/${id}/action`,
      payload,
    ),

  // ── Admin: Audit Log (super_admin only) ───────────────────────────
  getAuditLogs: (filters?: AuditLogFilters) =>
    api.get<ApiResponse<AuditLogResponse>>('/admin/moderation/audit-logs', {
      params: filters,
    }),

  // ── Admin: Staff list for filter dropdown ─────────────────────────
  getStaff: () =>
    api.get<ApiResponse<AdminStaffMember[]>>('/admin/moderation/staff'),

  // ── Admin Management ───────────────────────────────────────────────
  getAdmins: () =>
    api.get<ApiResponse<AdminMember[]>>('/admin'),

  createAdmin: (data: CreateAdminPayload) =>
    api.post<ApiResponse<CreateAdminResponse>>('/admin', data),

  updateAdminRole: (id: string, role: AdminRole) =>
    api.patch<ApiResponse<AdminMember>>(`/admin/${id}/role`, { role }),

  deleteAdmin: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/admin/${id}`),
};
