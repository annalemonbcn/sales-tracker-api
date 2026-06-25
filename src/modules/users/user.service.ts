import { prisma } from '../../shared/prisma.js';

// TODO: create userRespository
export const userService = {
  getUsers: async () => {
    return prisma.user.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  },
};
