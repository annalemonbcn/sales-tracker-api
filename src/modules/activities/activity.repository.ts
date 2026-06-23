import type { Prisma } from '../../generated/prisma/client.js';

type TransactionClient = Prisma.TransactionClient;

const activityUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} satisfies Prisma.UserSelect;

export const activityRepository = {
  findBusinessById: (tx: TransactionClient, businessId: string) => {
    return tx.business.findUnique({
      where: {
        id: businessId,
      },
      select: {
        id: true,
      },
    });
  },

  findManyByBusinessId: (tx: TransactionClient, businessId: string) => {
    return tx.activity.findMany({
      where: {
        businessId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: activityUserSelect,
        },
      },
    });
  },
};
