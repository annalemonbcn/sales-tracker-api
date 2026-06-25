import { AppError } from '../../shared/errors.js';
import { prisma } from '../../shared/prisma.js';
import type {
  CreateActivityInput,
  CreateActivityParams,
  GetBusinessActivitiesParams,
} from './activity.schemas.js';
import { activityRepository } from './activity.repository.js';
import {
  buildBusinessUpdateDataFromActivity,
  buildManualActivityCreateData,
  getNextStatusFromActivityType,
} from './activity.prisma-mapper.js';
import { buildStatusChangedActivityData } from '../businesses/business.prisma-mapper.js';

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

      const activity = await activityRepository.createActivity(
        tx,
        buildManualActivityCreateData(params, data),
      );

      const contactedAt = new Date();

      const businessUpdateData = buildBusinessUpdateDataFromActivity({
        type: data.type,
        contactedAt,
      });

      if (Object.keys(businessUpdateData).length > 0) {
        await activityRepository.updateBusiness(
          tx,
          params.businessId,
          businessUpdateData,
        );
      }

      const nextStatus = getNextStatusFromActivityType(data.type);

      if (nextStatus !== undefined && nextStatus !== business.status) {
        await activityRepository.createActivity(
          tx,
          buildStatusChangedActivityData({
            businessId: params.businessId,
            userId: data.userId,
            previousStatus: business.status,
            nextStatus,
          }),
        );
      }

      return activity;
    });
  },
};
