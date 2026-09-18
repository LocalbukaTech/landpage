import { useQuery, useMutation } from '@tanstack/react-query';
import {
  insightsService,
  type InsightsPeriod,
} from './insights.service';

const KEYS = {
  dashboard: (period: InsightsPeriod, demo: boolean) =>
    ['insights', 'dashboard', period, demo] as const,
  overview: (period: InsightsPeriod, demo: boolean) =>
    ['insights', 'overview', period, demo] as const,
  content: (period: InsightsPeriod, demo: boolean) =>
    ['insights', 'content', period, demo] as const,
  audience: (period: InsightsPeriod, demo: boolean) =>
    ['insights', 'audience', period, demo] as const,
};

/** Full all-in-one dashboard */
export function useInsightsDashboard(
  period: InsightsPeriod = '7d',
  demo = false
) {
  return useQuery({
    queryKey: KEYS.dashboard(period, demo),
    queryFn: async () => {
      const res = await insightsService.getDashboard(period, demo);
      return (res as any)?.data?.data ?? (res as any)?.data ?? res;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 1,
  });
}

/** Overview tab only */
export function useInsightsOverview(
  period: InsightsPeriod = '7d',
  demo = false
) {
  return useQuery({
    queryKey: KEYS.overview(period, demo),
    queryFn: async () => {
      const res = await insightsService.getOverview(period, demo);
      return (res as any)?.data?.data ?? (res as any)?.data ?? res;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

/** Content tab only */
export function useInsightsContent(
  period: InsightsPeriod = '7d',
  demo = false
) {
  return useQuery({
    queryKey: KEYS.content(period, demo),
    queryFn: async () => {
      const res = await insightsService.getContent(period, demo);
      return (res as any)?.data?.data ?? (res as any)?.data ?? res;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

/** Audience tab only */
export function useInsightsAudience(
  period: InsightsPeriod = '7d',
  demo = false
) {
  return useQuery({
    queryKey: KEYS.audience(period, demo),
    queryFn: async () => {
      const res = await insightsService.getAudience(period, demo);
      return (res as any)?.data?.data ?? (res as any)?.data ?? res;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

/** Batch-report post views */
export function useBatchReportViews() {
  return useMutation({
    mutationFn: (postIds: string[]) =>
      insightsService.batchReportViews(postIds),
  });
}

