import type { Prisma } from '../../generated/prisma/client.js';

type TransactionClient = Prisma.TransactionClient;

const followUpUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} satisfies Prisma.UserSelect;

export const followUpRepository = {
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
    return tx.followUp.findMany({
      where: {
        businessId,
      },
      orderBy: [
        {
          status: 'asc',
        },
        {
          dueDate: 'asc',
        },
      ],
      include: {
        assignedTo: {
          select: followUpUserSelect,
        },
      },
    });
  },
};
