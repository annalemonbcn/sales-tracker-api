import { AppError } from '../../shared/errors.js';
import { prisma } from '../../shared/prisma.js';
import type { GetBusinessActivitiesParams } from './activity.schemas.js';
import { activityRepository } from './activity.repository.js';

export const activityService = {
  getBusinessActivities: async (params: GetBusinessActivitiesParams) => {
    return prisma.$transaction(async (tx) => {
      const business = await activityRepository.findBusinessById(
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

      return activityRepository.findManyByBusinessId(tx, params.businessId);
    });
  },
};
