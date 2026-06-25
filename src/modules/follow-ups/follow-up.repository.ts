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
        nextFollowUpAt: true,
      },
    });
  },

  findUserById: (tx: TransactionClient, userId: string) => {
    return tx.user.findUnique({
      where: {
        id: userId,
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

  createFollowUp: (
    tx: TransactionClient,
    data: Prisma.FollowUpUncheckedCreateInput,
  ) => {
    return tx.followUp.create({
      data,
      include: {
        assignedTo: {
          select: followUpUserSelect,
        },
      },
    });
  },

  createActivity: (
    tx: TransactionClient,
    data: Prisma.ActivityUncheckedCreateInput,
  ) => {
    return tx.activity.create({
      data,
    });
  },

  updateBusiness: (
    tx: TransactionClient,
    businessId: string,
    data: Prisma.BusinessUpdateInput,
  ) => {
    return tx.business.update({
      where: {
        id: businessId,
      },
      data,
    });
  },
};
