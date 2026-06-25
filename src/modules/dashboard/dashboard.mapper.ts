export type DashboardMetricDto = {
  value: number;
  currentMonth: number;
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

export const toDashboardSummaryDto = (
  input: DashboardSummaryInput,
): DashboardSummaryDto => {
  return {
    metrics: {
      totalBusinesses: {
        value: input.totalBusinesses,
        currentMonth: input.totalBusinessesCurrentMonth,
      },
      contactedBusinesses: {
        value: input.contactedBusinesses,
        currentMonth: input.contactedBusinessesCurrentMonth,
      },
      pendingFollowUps: {
        value: input.pendingFollowUps,
        currentMonth: input.pendingFollowUpsCurrentMonth,
      },
      highPriorityBusinesses: {
        value: input.highPriorityBusinesses,
        currentMonth: input.highPriorityBusinessesCurrentMonth,
      },
    },
  };
};
