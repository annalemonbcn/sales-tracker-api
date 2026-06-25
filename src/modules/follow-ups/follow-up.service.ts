import { AppError } from '../../shared/errors.js';
import { prisma } from '../../shared/prisma.js';
import {
  buildBusinessNextFollowUpUpdateData,
  buildFollowUpCreatedActivityData,
  buildFollowUpCreateData,
  shouldUpdateNextFollowUpAt,
} from './follow-up.prisma-mapper.js';
import { followUpRepository } from './follow-up.repository.js';
import type {
  CreateFollowUpInput,
  CreateFollowUpParams,
  GetBusinessFollowUpsParams,
} from './follow-up.schemas.js';

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

  createFollowUp: async (
    params: CreateFollowUpParams,
    data: CreateFollowUpInput,
  ) => {
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

      const assignedUser = await followUpRepository.findUserById(
        tx,
        data.assignedToId,
      );

      if (!assignedUser) {
        throw new AppError({
          statusCode: 404,
          code: 'ASSIGNED_USER_NOT_FOUND',
          message: 'Assigned user not found',
        });
      }

      const followUp = await followUpRepository.createFollowUp(
        tx,
        buildFollowUpCreateData(params, data),
      );

      await followUpRepository.createActivity(
        tx,
        buildFollowUpCreatedActivityData({
          businessId: params.businessId,
          userId: data.assignedToId,
          followUpId: followUp.id,
          dueDate: followUp.dueDate,
        }),
      );

      if (
        shouldUpdateNextFollowUpAt({
          currentNextFollowUpAt: business.nextFollowUpAt,
          newDueDate: followUp.dueDate,
        })
      ) {
        await followUpRepository.updateBusiness(
          tx,
          params.businessId,
          buildBusinessNextFollowUpUpdateData(followUp.dueDate),
        );
      }

      return followUp;
    });
  },
};
