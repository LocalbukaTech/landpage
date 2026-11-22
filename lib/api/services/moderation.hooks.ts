import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  moderationService,
  type ModerationQueueFilters,
  type ModerationActionPayload,
  type AuditLogFilters,
  type AdminRole,
  type CreateAdminPayload,
  type SubmitReportPayload,
} from './moderation.service';

// ── Query Keys ────────────────────────────────────────────────────────────────
export const moderationKeys = {
  all: ['moderation'] as const,
  queue: (filters?: ModerationQueueFilters) =>
    [...moderationKeys.all, 'queue', filters] as const,
  report: (id: string) => [...moderationKeys.all, 'report', id] as const,
  auditLogs: (filters?: AuditLogFilters) =>
    [...moderationKeys.all, 'audit-logs', filters] as const,
  staff: () => [...moderationKeys.all, 'staff'] as const,
  admins: () => [...moderationKeys.all, 'admins'] as const,
};

// ── User-facing Hooks ─────────────────────────────────────────────────────────

export const useSubmitReport = () => {
  return useMutation({
    mutationFn: (data: SubmitReportPayload | FormData) =>
      moderationService.submitReport(data),
  });
};

export const useSubmitPostReport = () => {
  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: string;
      data: Pick<SubmitReportPayload, 'reason' | 'notes' | 'link' | 'isAnonymous'>;
    }) => moderationService.submitPostReport(postId, data),
  });
};

export const useSubmitUserReport = () => {
  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: Pick<SubmitReportPayload, 'reason' | 'notes' | 'link' | 'isAnonymous'>;
    }) => moderationService.submitUserReport(userId, data),
  });
};

// ── Admin: Moderation Queue ───────────────────────────────────────────────────

export const useModerationQueue = (filters?: ModerationQueueFilters) => {
  return useQuery({
    queryKey: moderationKeys.queue(filters),
    queryFn: async () => {
      const res = await moderationService.getQueue(filters);
      return res.data;
    },
  });
};

// ── Admin: Report Review ──────────────────────────────────────────────────────

export const useReportReview = (id: string) => {
  return useQuery({
    queryKey: moderationKeys.report(id),
    queryFn: async () => {
      const res = await moderationService.getReport(id);
      return res.data;
    },
    enabled: !!id,
  });
};

// ── Admin: Take Action ────────────────────────────────────────────────────────

export const useTakeAction = (reportId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ModerationActionPayload) =>
      moderationService.takeAction(reportId, payload),
    onSuccess: () => {
      // Invalidate both the specific report and the full queue
      queryClient.invalidateQueries({ queryKey: moderationKeys.report(reportId) });
      queryClient.invalidateQueries({ queryKey: moderationKeys.all });
    },
  });
};

// ── Admin: Audit Logs ─────────────────────────────────────────────────────────

export const useAuditLogs = (filters?: AuditLogFilters) => {
  return useQuery({
    queryKey: moderationKeys.auditLogs(filters),
    queryFn: async () => {
      const res = await moderationService.getAuditLogs(filters);
      return res.data;
    },
  });
};

// ── Admin: Staff List ─────────────────────────────────────────────────────────

export const useModerationStaff = () => {
  return useQuery({
    queryKey: moderationKeys.staff(),
    queryFn: async () => {
      const res = await moderationService.getStaff();
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // cache for 5 min — rarely changes
  });
};

// ── Admin Management ──────────────────────────────────────────
export const useAdminsList = () => {
  return useQuery({
    queryKey: moderationKeys.admins(),
    queryFn: async () => {
      const res = await moderationService.getAdmins();
      return res.data;
    },
    staleTime: 60 * 1000,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAdminPayload) => moderationService.createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moderationKeys.admins() });
      queryClient.invalidateQueries({ queryKey: moderationKeys.staff() });
    },
  });
};

export const useUpdateAdminRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: AdminRole }) =>
      moderationService.updateAdminRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moderationKeys.admins() });
      queryClient.invalidateQueries({ queryKey: moderationKeys.staff() });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => moderationService.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moderationKeys.admins() });
      queryClient.invalidateQueries({ queryKey: moderationKeys.staff() });
    },
  });
};
