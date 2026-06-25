import { AppError } from '../../shared/errors.js';
import { prisma } from '../../shared/prisma.js';
import {
  buildBusinessNextFollowUpRecalculationData,
  buildBusinessNextFollowUpUpdateData,
  buildFollowUpCreatedActivityData,
  buildFollowUpCreateData,
  buildFollowUpDoneActivityData,
  buildFollowUpDoneUpdateData,
  shouldUpdateNextFollowUpAt,
} from './follow-up.prisma-mapper.js';
import { followUpRepository } from './follow-up.repository.js';
import type {
  CreateFollowUpInput,
  CreateFollowUpParams,
  GetBusinessFollowUpsParams,
  MarkFollowUpDoneParams,
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

  markFollowUpDone: async (params: MarkFollowUpDoneParams) => {
    return prisma.$transaction(async (tx) => {
      const followUp = await followUpRepository.findById(tx, params.followUpId);

      if (!followUp) {
        throw new AppError({
          statusCode: 404,
          code: 'FOLLOW_UP_NOT_FOUND',
          message: 'Follow-up not found',
        });
      }

      if (followUp.status === 'cancelled') {
        throw new AppError({
          statusCode: 409,
          code: 'FOLLOW_UP_CANCELLED',
          message: 'Cancelled follow-ups cannot be marked as done',
        });
      }

      if (followUp.status === 'done') {
        return followUp;
      }

      const completedAt = new Date();

      const updatedFollowUp = await followUpRepository.updateFollowUp(
        tx,
        params.followUpId,
        buildFollowUpDoneUpdateData(completedAt),
      );

      await followUpRepository.createActivity(
        tx,
        buildFollowUpDoneActivityData({
          businessId: followUp.businessId,
          userId: followUp.assignedToId,
          followUpId: followUp.id,
          completedAt,
        }),
      );

      const nextPendingFollowUp =
        await followUpRepository.findNextPendingByBusinessId(
          tx,
          followUp.businessId,
        );

      await followUpRepository.updateBusiness(
        tx,
        followUp.businessId,
        buildBusinessNextFollowUpRecalculationData(
          nextPendingFollowUp?.dueDate ?? null,
        ),
      );

      return updatedFollowUp;
    });
  },
};
