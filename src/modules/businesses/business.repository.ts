import { Prisma } from '../../generated/prisma/client.js';

export const businessUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} satisfies Prisma.UserSelect;

type TransactionClient = Prisma.TransactionClient;

export const businessRepository = {
  findUserById: (tx: TransactionClient, userId: string) => {
    return tx.user.findUnique({
      where: {
        id: userId,
      },
    });
  },

  findBusinessById: (tx: TransactionClient, businessId: string) => {
    return tx.business.findUnique({
      where: {
        id: businessId,
      },
      include: {
        createdBy: {
          select: businessUserSelect,
        },
        assignedTo: {
          select: businessUserSelect,
        },
      },
    });
  },

  findManyBusinesses: (
    tx: TransactionClient,
    where: Prisma.BusinessWhereInput,
  ) => {
    return tx.business.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        createdBy: {
          select: businessUserSelect,
        },
        assignedTo: {
          select: businessUserSelect,
        },
      },
    });
  },

  createBusiness: (tx: TransactionClient, data: Prisma.BusinessCreateInput) => {
    return tx.business.create({
      data,
      include: {
        createdBy: {
          select: businessUserSelect,
        },
        assignedTo: {
          select: businessUserSelect,
        },
      },
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
      include: {
        createdBy: {
          select: businessUserSelect,
        },
        assignedTo: {
          select: businessUserSelect,
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
};
