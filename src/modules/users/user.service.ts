import { prisma } from '../../shared/prisma.js';

export const userService = {
  getUsers: async () => {
    return prisma.user.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  },
};
