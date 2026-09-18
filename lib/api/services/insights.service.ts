import { api } from '../client';

export type InsightsPeriod = '7d' | '30d' | '90d' | 'all';

// ── Shared sub-types ──────────────────────────────────────────────────────────

export interface InsightsChartPoint {
  date: string;
  label: string;
  value: number;
  tooltipValue: string;
  isHighlight?: boolean;
}

export interface InsightsPeakPoint {
  date: string;
  label: string;
  value: number;
  displayValue: string;
}

export interface InsightsMetric {
  label: string;
  key: string;
  value: number;
  formattedValue: string;
  percentageChange: number;
  isPositive: boolean;
  formattedChange: string;
}

// ── Overview ──────────────────────────────────────────────────────────────────

export interface InsightsOverviewData {
  period: string;
  metrics: {
    views: InsightsMetric;
    reach: InsightsMetric;
    engagement: InsightsMetric;
    newFollowers: InsightsMetric;
  };
  performanceOverTime: {
    title: string;
    status: string;
    yAxisMin: number;
    yAxisMax: number;
    data: InsightsChartPoint[];
    peakPoint: InsightsPeakPoint;
  };
}

// ── Content ───────────────────────────────────────────────────────────────────

export interface InsightsContentPost {
  id: string;
  rank: number;
  title: string;
  thumbnail: string;
  date: string;
  count: number;
  formatted: string;
}

export interface InsightsContentData {
  period: string;
  highestViews: InsightsContentPost[];
  highestReach: InsightsContentPost[];
  highestLikes: InsightsContentPost[];
}

// ── Audience ──────────────────────────────────────────────────────────────────

export interface InsightsAudienceData {
  period: string;
  totalFollowers: {
    count: number;
    formattedCount: string;
    growthPercentage: number;
    statusNote: string;
  };
  followersGrowthOverTime: {
    title: string;
    yAxisMin: number;
    yAxisMax: number;
    data: InsightsChartPoint[];
    peakPoint: InsightsPeakPoint;
  };
  topLocations: {
    title: string;
    note: string;
    data: { location: string; percentage: number }[];
  };
}

// ── Full dashboard (GET /insights) ────────────────────────────────────────────

export interface InsightsDashboard {
  period: string;
  periodLabel: string;
  availablePeriods: { id: string; label: string }[];
  overview: InsightsOverviewData;
  content: InsightsContentData;
  audience: InsightsAudienceData;
}

// ── Service ───────────────────────────────────────────────────────────────────

export const insightsService = {
  /** GET /insights — all-in-one dashboard for the current user */
  getDashboard: (period: InsightsPeriod = '7d', demo = false) =>
    api.get<{ data: InsightsDashboard }>('/insights', {
      params: { period, ...(demo ? { demo: 'true' } : {}) },
    }),

  /** GET /insights/overview */
  getOverview: (period: InsightsPeriod = '7d', demo = false) =>
    api.get<{ data: InsightsOverviewData }>('/insights/overview', {
      params: { period, ...(demo ? { demo: 'true' } : {}) },
    }),

  /** GET /insights/content */
  getContent: (period: InsightsPeriod = '7d', demo = false) =>
    api.get<{ data: InsightsContentData }>('/insights/content', {
      params: { period, ...(demo ? { demo: 'true' } : {}) },
    }),

  /** GET /insights/audience */
  getAudience: (period: InsightsPeriod = '7d', demo = false) =>
    api.get<{ data: InsightsAudienceData }>('/insights/audience', {
      params: { period, ...(demo ? { demo: 'true' } : {}) },
    }),

  /** POST /posts/views/batch — report viewed post IDs */
  batchReportViews: (postIds: string[]) =>
    api.post('/posts/views/batch', { postIds }),
};
