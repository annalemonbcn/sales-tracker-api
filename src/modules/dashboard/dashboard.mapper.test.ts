import { describe, expect, it } from 'vitest';

import {
  getGrowthMetricTrendVariant,
  getHighPriorityBusinessesTrendVariant,
  getPendingFollowUpsTrendVariant,
  toDashboardSummaryDto,
} from './dashboard.mapper.js';

describe('toDashboardSummaryDto', () => {
  it('maps dashboard counts to DashboardSummaryDto', () => {
    const result = toDashboardSummaryDto({
      totalBusinesses: 148,
      totalBusinessesCurrentMonth: 12,
      contactedBusinesses: 67,
      contactedBusinessesCurrentMonth: 8,
      pendingFollowUps: 29,
      pendingFollowUpsCurrentMonth: 5,
      highPriorityBusinesses: 18,
      highPriorityBusinessesCurrentMonth: 4,
    });

    expect(result).toEqual({
      metrics: {
        totalBusinesses: {
          value: 148,
          currentMonth: 12,
          trendVariant: 'success',
        },
        contactedBusinesses: {
          value: 67,
          currentMonth: 8,
          trendVariant: 'warning',
        },
        pendingFollowUps: {
          value: 29,
          currentMonth: 5,
          trendVariant: 'neutral',
        },
        highPriorityBusinesses: {
          value: 18,
          currentMonth: 4,
          trendVariant: 'warning',
        },
      },
    });
  });

  it('maps zero values correctly', () => {
    const result = toDashboardSummaryDto({
      totalBusinesses: 0,
      totalBusinessesCurrentMonth: 0,
      contactedBusinesses: 0,
      contactedBusinessesCurrentMonth: 0,
      pendingFollowUps: 0,
      pendingFollowUpsCurrentMonth: 0,
      highPriorityBusinesses: 0,
      highPriorityBusinessesCurrentMonth: 0,
    });

    expect(result).toEqual({
      metrics: {
        totalBusinesses: {
          value: 0,
          currentMonth: 0,
          trendVariant: 'danger',
        },
        contactedBusinesses: {
          value: 0,
          currentMonth: 0,
          trendVariant: 'danger',
        },
        pendingFollowUps: {
          value: 0,
          currentMonth: 0,
          trendVariant: 'success',
        },
        highPriorityBusinesses: {
          value: 0,
          currentMonth: 0,
          trendVariant: 'success',
        },
      },
    });
  });
});

describe('getGrowthMetricTrendVariant', () => {
  it('returns success when current month value is greater than 10', () => {
    expect(getGrowthMetricTrendVariant(11)).toBe('success');
  });

  it('returns danger when current month value is 0', () => {
    expect(getGrowthMetricTrendVariant(0)).toBe('danger');
  });

  it('returns warning when current month value is greater than 4', () => {
    expect(getGrowthMetricTrendVariant(5)).toBe('warning');
  });

  it('returns neutral for low positive values', () => {
    expect(getGrowthMetricTrendVariant(3)).toBe('neutral');
  });
});

describe('getPendingFollowUpsTrendVariant', () => {
  it('returns success when there are no pending follow-ups created this month', () => {
    expect(getPendingFollowUpsTrendVariant(0)).toBe('success');
  });

  it('returns danger when current month value is greater than 10', () => {
    expect(getPendingFollowUpsTrendVariant(11)).toBe('danger');
  });

  it('returns warning when current month value is greater than 5', () => {
    expect(getPendingFollowUpsTrendVariant(6)).toBe('warning');
  });

  it('returns neutral for moderate values', () => {
    expect(getPendingFollowUpsTrendVariant(3)).toBe('neutral');
  });
});

describe('getHighPriorityBusinessesTrendVariant', () => {
  it('returns success when there are no high priority businesses created this month', () => {
    expect(getHighPriorityBusinessesTrendVariant(0)).toBe('success');
  });

  it('returns danger when current month value is greater than 8', () => {
    expect(getHighPriorityBusinessesTrendVariant(9)).toBe('danger');
  });

  it('returns warning when current month value is greater than 3', () => {
    expect(getHighPriorityBusinessesTrendVariant(4)).toBe('warning');
  });

  it('returns neutral for low positive values', () => {
    expect(getHighPriorityBusinessesTrendVariant(2)).toBe('neutral');
  });
});

describe('toDashboardSummaryDto', () => {
  it('maps dashboard counts to DashboardSummaryDto with trend variants', () => {
    const result = toDashboardSummaryDto({
      totalBusinesses: 148,
      totalBusinessesCurrentMonth: 12,
      contactedBusinesses: 67,
      contactedBusinessesCurrentMonth: 8,
      pendingFollowUps: 29,
      pendingFollowUpsCurrentMonth: 6,
      highPriorityBusinesses: 18,
      highPriorityBusinessesCurrentMonth: 4,
    });

    expect(result).toEqual({
      metrics: {
        totalBusinesses: {
          value: 148,
          currentMonth: 12,
          trendVariant: 'success',
        },
        contactedBusinesses: {
          value: 67,
          currentMonth: 8,
          trendVariant: 'warning',
        },
        pendingFollowUps: {
          value: 29,
          currentMonth: 6,
          trendVariant: 'warning',
        },
        highPriorityBusinesses: {
          value: 18,
          currentMonth: 4,
          trendVariant: 'warning',
        },
      },
    });
  });

  it('maps zero values correctly', () => {
    const result = toDashboardSummaryDto({
      totalBusinesses: 0,
      totalBusinessesCurrentMonth: 0,
      contactedBusinesses: 0,
      contactedBusinessesCurrentMonth: 0,
      pendingFollowUps: 0,
      pendingFollowUpsCurrentMonth: 0,
      highPriorityBusinesses: 0,
      highPriorityBusinessesCurrentMonth: 0,
    });

    expect(result).toEqual({
      metrics: {
        totalBusinesses: {
          value: 0,
          currentMonth: 0,
          trendVariant: 'danger',
        },
        contactedBusinesses: {
          value: 0,
          currentMonth: 0,
          trendVariant: 'danger',
        },
        pendingFollowUps: {
          value: 0,
          currentMonth: 0,
          trendVariant: 'success',
        },
        highPriorityBusinesses: {
          value: 0,
          currentMonth: 0,
          trendVariant: 'success',
        },
      },
    });
  });
});
