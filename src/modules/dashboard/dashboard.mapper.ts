export type DashboardMetricTrendVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral';

export type DashboardMetricDto = {
  value: number;
  currentMonth: number;
  trendVariant: DashboardMetricTrendVariant;
};

export type DashboardSummaryDto = {
  metrics: {
    totalBusinesses: DashboardMetricDto;
    contactedBusinesses: DashboardMetricDto;
    pendingFollowUps: DashboardMetricDto;
    highPriorityBusinesses: DashboardMetricDto;
  };
};

type DashboardSummaryInput = {
  totalBusinesses: number;
  totalBusinessesCurrentMonth: number;
  contactedBusinesses: number;
  contactedBusinessesCurrentMonth: number;
  pendingFollowUps: number;
  pendingFollowUpsCurrentMonth: number;
  highPriorityBusinesses: number;
  highPriorityBusinessesCurrentMonth: number;
};

export const getGrowthMetricTrendVariant = (
  currentMonth: number,
): DashboardMetricTrendVariant => {
  if (currentMonth > 10) {
    return 'success';
  }

  if (currentMonth === 0) {
    return 'danger';
  }

  if (currentMonth > 4) {
    return 'warning';
  }

  return 'neutral';
};

export const getPendingFollowUpsTrendVariant = (
  currentMonth: number,
): DashboardMetricTrendVariant => {
  if (currentMonth === 0) {
    return 'success';
  }

  if (currentMonth > 10) {
    return 'danger';
  }

  if (currentMonth > 5) {
    return 'warning';
  }

  return 'neutral';
};

export const getHighPriorityBusinessesTrendVariant = (
  currentMonth: number,
): DashboardMetricTrendVariant => {
  if (currentMonth === 0) {
    return 'success';
  }

  if (currentMonth > 8) {
    return 'danger';
  }

  if (currentMonth > 3) {
    return 'warning';
  }

  return 'neutral';
};

export const toDashboardSummaryDto = (
  input: DashboardSummaryInput,
): DashboardSummaryDto => {
  return {
    metrics: {
      totalBusinesses: {
        value: input.totalBusinesses,
        currentMonth: input.totalBusinessesCurrentMonth,
        trendVariant: getGrowthMetricTrendVariant(
          input.totalBusinessesCurrentMonth,
        ),
      },
      contactedBusinesses: {
        value: input.contactedBusinesses,
        currentMonth: input.contactedBusinessesCurrentMonth,
        trendVariant: getGrowthMetricTrendVariant(
          input.contactedBusinessesCurrentMonth,
        ),
      },
      pendingFollowUps: {
        value: input.pendingFollowUps,
        currentMonth: input.pendingFollowUpsCurrentMonth,
        trendVariant: getPendingFollowUpsTrendVariant(
          input.pendingFollowUpsCurrentMonth,
        ),
      },
      highPriorityBusinesses: {
        value: input.highPriorityBusinesses,
        currentMonth: input.highPriorityBusinessesCurrentMonth,
        trendVariant: getHighPriorityBusinessesTrendVariant(
          input.highPriorityBusinessesCurrentMonth,
        ),
      },
    },
  };
};
