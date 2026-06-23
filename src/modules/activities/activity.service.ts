import { AppError } from '../../shared/errors.js';
import { prisma } from '../../shared/prisma.js';
import type {
  CreateActivityInput,
  CreateActivityParams,
  GetBusinessActivitiesParams,
} from './activity.schemas.js';
import { activityRepository } from './activity.repository.js';
import { buildManualActivityCreateData } from './activity.prisma-mapper.js';

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

  createActivity: async (
    params: CreateActivityParams,
    data: CreateActivityInput,
  ) => {
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

      const user = await activityRepository.findUserById(tx, data.userId);

      if (!user) {
        throw new AppError({
          statusCode: 404,
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        });
      }

      return activityRepository.createActivity(
        tx,
        buildManualActivityCreateData(params, data),
      );
    });
  },
};
