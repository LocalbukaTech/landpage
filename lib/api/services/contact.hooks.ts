import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  contactService,
  type AboutUsContent,
  type BrandedReplyPayload,
  type ContactInfoContent,
  type ContactListData,
  type ContactInquiry,
  type ContactStatus,
  type SendTemplateEmailPayload,
  type SiteSettingsData,
  type UpdateContactPayload,
} from './contact.service';
import { queryKeys, type ApiResponse } from '../types';

export type ContactListResponse = ApiResponse<ContactListData>;
export type ContactResponse = ApiResponse<ContactInquiry>;
export type SiteSettingsResponse = ApiResponse<SiteSettingsData>;

const SITE_SETTINGS_QUERY_KEY = [...queryKeys.contact.all, 'site-settings'] as const;

export const useContactsQuery = (params?: {
  page?: number;
  size?: number;
  status?: ContactStatus;
  q?: string;
}) => {
  return useQuery<ContactListResponse>({
    queryKey: [...queryKeys.contact.list(params as Record<string, unknown>)],
    queryFn: () => contactService.list(params),
  });
};

export const useContactByIdQuery = (id: string | null) => {
  return useQuery<ContactResponse>({
    queryKey: [...queryKeys.contact.detail(id || '')],
    queryFn: () => contactService.getById(id!),
    enabled: !!id,
  });
};

export const useUpdateContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactPayload }) =>
      contactService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.detail(id) });
    },
  });
};

export const useDeleteContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
    },
  });
};

export const useBulkDeleteContactsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => contactService.bulkRemove(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
    },
  });
};

export const useReplyContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: BrandedReplyPayload;
    }) => contactService.reply(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.detail(id) });
    },
  });
};

export const useSendTemplateEmailMutation = () => {
  return useMutation({
    mutationFn: (data: SendTemplateEmailPayload) =>
      contactService.sendTemplateEmail(data),
  });
};

export const useIngestInboundEmailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactService.ingestInboundEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
    },
  });
};

export const useSiteSettingsQuery = () => {
  return useQuery<SiteSettingsResponse>({
    queryKey: SITE_SETTINGS_QUERY_KEY,
    queryFn: () => contactService.getSiteSettings(),
    staleTime: 60_000,
    retry: 1,
  });
};

export const useUpdateSiteSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      aboutUs?: Partial<AboutUsContent>;
      contactInfo?: Partial<ContactInfoContent>;
    }) => contactService.updateSiteSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITE_SETTINGS_QUERY_KEY });
    },
  });
};
