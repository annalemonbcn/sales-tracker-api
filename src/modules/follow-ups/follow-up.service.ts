import { AppError } from '../../shared/errors.js';
import { prisma } from '../../shared/prisma.js';
import { followUpRepository } from './follow-up.repository.js';
import type { GetBusinessFollowUpsParams } from './follow-up.schemas.js';

export const followUpService = {
  getBusinessFollowUps: async (params: GetBusinessFollowUpsParams) => {
    return prisma.$transaction(async (tx) => {
      const business = await followUpRepository.findBusinessById(
        tx,
        params.businessId,
      );

      if (!business) {
        throw new AppError({
          statusCode: 404,
          code: 'BUSINESS_NOT_FOUND',
          message: 'Business not found',
        });
      }

      return followUpRepository.findManyByBusinessId(tx, params.businessId);
    });
  },
};
