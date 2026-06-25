import { describe, expect, it } from 'vitest';

import { toDashboardSummaryDto } from './dashboard.mapper.js';

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
        },
        contactedBusinesses: {
          value: 67,
          currentMonth: 8,
        },
        pendingFollowUps: {
          value: 29,
          currentMonth: 5,
        },
        highPriorityBusinesses: {
          value: 18,
          currentMonth: 4,
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
        },
        contactedBusinesses: {
          value: 0,
          currentMonth: 0,
        },
        pendingFollowUps: {
          value: 0,
          currentMonth: 0,
        },
        highPriorityBusinesses: {
          value: 0,
          currentMonth: 0,
        },
      },
    });
  });
});
