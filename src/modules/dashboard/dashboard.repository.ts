import type { Prisma } from '../../generated/prisma/client.js';
import { FollowUpStatus, Priority } from '../../generated/prisma/enums.js';

type TransactionClient = Prisma.TransactionClient;

export const dashboardRepository = {
  countBusinesses: (tx: TransactionClient) => {
    return tx.business.count();
  },

  countBusinessesCreatedFrom: (tx: TransactionClient, from: Date) => {
    return tx.business.count({
      where: {
        createdAt: {
          gte: from,
        },
      },
    });
  },

  countContactedBusinesses: (tx: TransactionClient) => {
    return tx.business.count({
      where: {
        lastContactedAt: {
          not: null,
        },
      },
    });
  },

  countContactedBusinessesFrom: (tx: TransactionClient, from: Date) => {
    return tx.business.count({
      where: {
        lastContactedAt: {
          gte: from,
        },
      },
    });
  },

  countPendingFollowUps: (tx: TransactionClient) => {
    return tx.followUp.count({
      where: {
        status: FollowUpStatus.pending,
      },
    });
  },

  countPendingFollowUpsCreatedFrom: (tx: TransactionClient, from: Date) => {
    return tx.followUp.count({
      where: {
        status: FollowUpStatus.pending,
        createdAt: {
          gte: from,
        },
      },
    });
  },

  countHighPriorityBusinesses: (tx: TransactionClient) => {
    return tx.business.count({
      where: {
        priority: Priority.high,
      },
    });
  },

  countHighPriorityBusinessesCreatedFrom: (
    tx: TransactionClient,
    from: Date,
  ) => {
    return tx.business.count({
      where: {
        priority: Priority.high,
        createdAt: {
          gte: from,
        },
      },
    });
  },
};
