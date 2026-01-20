import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {AxiosError} from 'axios';
import {
  teamsService,
  type Team,
  type TeamsListData,
  type TeamsQueryParams,
} from './teams.service';
import type {ApiError, ApiResponse} from '../types';
import {queryKeys} from '../types';

export type CreateTeamResponse = ApiResponse<Team>;
export type TeamsListResponse = ApiResponse<TeamsListData>;
export type TeamResponse = ApiResponse<Team>;
export type DeleteTeamResponse = {message: string};

export function useCreateTeamMutation(
  options?: UseMutationOptions<
    CreateTeamResponse,
    AxiosError<ApiError>,
    FormData
  >
) {
  return useMutation<CreateTeamResponse, AxiosError<ApiError>, FormData>({
    mutationFn: (data: FormData) => teamsService.create(data),
    ...options,
  });
}

export function useTeamsQuery(
  params?: TeamsQueryParams,
  options?: UseQueryOptions<TeamsListResponse, AxiosError<ApiError>>
) {
  return useQuery<TeamsListResponse, AxiosError<ApiError>>({
    queryKey: queryKeys.teams.list(params),
    queryFn: () => teamsService.list(params),
    ...options,
  });
}

export function useTeamQuery(
  id: string,
  options?: UseQueryOptions<TeamResponse, AxiosError<ApiError>>
) {
  return useQuery<TeamResponse, AxiosError<ApiError>>({
    queryKey: queryKeys.teams.detail(id),
    queryFn: () => teamsService.getById(id),
    enabled: !!id,
    ...options,
  });
}

export function useUpdateTeamMutation(
  options?: UseMutationOptions<
    TeamResponse,
    AxiosError<ApiError>,
    {id: string; data: FormData}
  >
) {
  const queryClient = useQueryClient();
  return useMutation<
    TeamResponse,
    AxiosError<ApiError>,
    {id: string; data: FormData}
  >({
    mutationFn: ({id, data}) => teamsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.teams.all});
    },
    ...options,
  });
}

export function useUpdateTeamStatusMutation(
  options?: UseMutationOptions<
    TeamResponse,
    AxiosError<ApiError>,
    {id: string; approved: boolean}
  >
) {
  const queryClient = useQueryClient();
  return useMutation<
    TeamResponse,
    AxiosError<ApiError>,
    {id: string; approved: boolean}
  >({
    mutationFn: ({id, approved}) => teamsService.updateStatus(id, approved),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.teams.all});
    },
    ...options,
  });
}

export function useDeleteTeamMutation(
  options?: UseMutationOptions<DeleteTeamResponse, AxiosError<ApiError>, string>
) {
  const queryClient = useQueryClient();
  return useMutation<DeleteTeamResponse, AxiosError<ApiError>, string>({
    mutationFn: (id) => teamsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.teams.all});
    },
    ...options,
  });
}
