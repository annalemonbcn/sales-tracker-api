import { prisma } from '../../shared/prisma.js';
import {
  toDashboardSummaryDto,
  type DashboardSummaryDto,
} from './dashboard.mapper.js';
import { dashboardRepository } from './dashboard.repository.js';

export const getStartOfCurrentMonth = (date: Date): Date => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
};

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummaryDto> => {
    return prisma.$transaction(async (tx) => {
      const now = new Date();
      const startOfCurrentMonth = getStartOfCurrentMonth(now);

      const [
        totalBusinesses,
        totalBusinessesCurrentMonth,
        contactedBusinesses,
        contactedBusinessesCurrentMonth,
        pendingFollowUps,
        pendingFollowUpsCurrentMonth,
        highPriorityBusinesses,
        highPriorityBusinessesCurrentMonth,
      ] = await Promise.all([
        dashboardRepository.countBusinesses(tx),
        dashboardRepository.countBusinessesCreatedFrom(tx, startOfCurrentMonth),

        dashboardRepository.countContactedBusinesses(tx),
        dashboardRepository.countContactedBusinessesFrom(
          tx,
          startOfCurrentMonth,
        ),

        dashboardRepository.countPendingFollowUps(tx),
        dashboardRepository.countPendingFollowUpsCreatedFrom(
          tx,
          startOfCurrentMonth,
        ),

        dashboardRepository.countHighPriorityBusinesses(tx),
        dashboardRepository.countHighPriorityBusinessesCreatedFrom(
          tx,
          startOfCurrentMonth,
        ),
      ]);

      return toDashboardSummaryDto({
        totalBusinesses,
        totalBusinessesCurrentMonth,
        contactedBusinesses,
        contactedBusinessesCurrentMonth,
        pendingFollowUps,
        pendingFollowUpsCurrentMonth,
        highPriorityBusinesses,
        highPriorityBusinessesCurrentMonth,
      });
    });
  },
};
