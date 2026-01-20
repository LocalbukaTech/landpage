import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
  waitlistService,
  type WaitlistListData,
  type Waitlist,
} from './waitlist.service';
import {queryKeys, type ApiResponse} from '../types';

export type WaitlistListResponse = ApiResponse<WaitlistListData>;
export type WaitlistResponse = ApiResponse<Waitlist>;

export const useWaitlistQuery = (params?: {page?: number; size?: number}) => {
  return useQuery<WaitlistListResponse>({
    queryKey: [queryKeys.waitlist, params],
    queryFn: () => waitlistService.list(params),
  });
};

export const useWaitlistByIdQuery = (id: string | null) => {
  return useQuery<WaitlistResponse>({
    queryKey: [queryKeys.waitlist, id],
    queryFn: () => waitlistService.getById(id!),
    enabled: !!id,
  });
};

export const useCreateWaitlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: waitlistService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [queryKeys.waitlist]});
    },
  });
};
