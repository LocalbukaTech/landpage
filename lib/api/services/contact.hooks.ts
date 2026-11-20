import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  contactService,
  type ContactListData,
  type ContactInquiry,
  type ContactStatus,
  type UpdateContactPayload,
} from './contact.service';
import { queryKeys, type ApiResponse } from '../types';

export type ContactListResponse = ApiResponse<ContactListData>;
export type ContactResponse = ApiResponse<ContactInquiry>;

export const useContactsQuery = (params?: {
  page?: number;
  size?: number;
  status?: ContactStatus;
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

export const useReplyContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { subject?: string; replyMessage: string };
    }) => contactService.reply(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.detail(id) });
    },
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
