import { AppError } from '../../shared/errors.js';
import { prisma } from '../../shared/prisma.js';
import {
  buildBusinessNextFollowUpRecalculationData,
  buildBusinessNextFollowUpUpdateData,
  buildFollowUpCancelledActivityData,
  buildFollowUpCancelUpdateData,
  buildFollowUpCreatedActivityData,
  buildFollowUpCreateData,
  buildFollowUpDoneActivityData,
  buildFollowUpDoneUpdateData,
  buildFollowUpUpdatedActivityData,
  buildFollowUpUpdateData,
  buildFollowUpWhere,
  shouldUpdateNextFollowUpAt,
} from './follow-up.prisma-mapper.js';
import { followUpRepository } from './follow-up.repository.js';
import type {
  CancelFollowUpInput,
  CancelFollowUpParams,
  CreateFollowUpInput,
  CreateFollowUpParams,
  GetBusinessFollowUpsParams,
  GetFollowUpsQuery,
  MarkFollowUpDoneParams,
  MarkFollowUpDoneInput,
  UpdateFollowUpInput,
  UpdateFollowUpParams,
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

  getFollowUps: async (query: GetFollowUpsQuery) => {
    return prisma.$transaction(async (tx) => {
      const where = buildFollowUpWhere(query);

      return followUpRepository.findMany(tx, where);
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

      const creatingUser = await followUpRepository.findUserById(
        tx,
        data.userId,
      );

      if (!creatingUser) {
        throw new AppError({
          statusCode: 404,
          code: 'USER_NOT_FOUND',
          message: 'User not found',
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
          userId: data.userId,
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

  markFollowUpDone: async (
    params: MarkFollowUpDoneParams,
    data: MarkFollowUpDoneInput,
  ) => {
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

      const completingUser = await followUpRepository.findUserById(
        tx,
        data.userId,
      );

      if (!completingUser) {
        throw new AppError({
          statusCode: 404,
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        });
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
          userId: data.userId,
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

  cancelFollowUp: async (
    params: CancelFollowUpParams,
    data: CancelFollowUpInput,
  ) => {
    return prisma.$transaction(async (tx) => {
      const followUp = await followUpRepository.findById(tx, params.followUpId);

      if (!followUp) {
        throw new AppError({
          statusCode: 404,
          code: 'FOLLOW_UP_NOT_FOUND',
          message: 'Follow-up not found',
        });
      }

      if (followUp.status === 'done') {
        throw new AppError({
          statusCode: 409,
          code: 'FOLLOW_UP_ALREADY_DONE',
          message: 'Done follow-ups cannot be cancelled',
        });
      }

      if (followUp.status === 'cancelled') {
        return followUp;
      }

      const cancellingUser = await followUpRepository.findUserById(
        tx,
        data.userId,
      );

      if (!cancellingUser) {
        throw new AppError({
          statusCode: 404,
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        });
      }

      const cancelledAt = new Date();

      const updatedFollowUp = await followUpRepository.updateFollowUp(
        tx,
        params.followUpId,
        buildFollowUpCancelUpdateData(),
      );

      await followUpRepository.createActivity(
        tx,
        buildFollowUpCancelledActivityData({
          businessId: followUp.businessId,
          userId: data.userId,
          followUpId: followUp.id,
          cancelledAt,
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

  updateFollowUp: async (
    params: UpdateFollowUpParams,
    data: UpdateFollowUpInput,
  ) => {
    return prisma.$transaction(async (tx) => {
      const followUp = await followUpRepository.findById(tx, params.followUpId);

      if (!followUp) {
        throw new AppError({
          statusCode: 404,
          code: 'FOLLOW_UP_NOT_FOUND',
          message: 'Follow-up not found',
        });
      }

      if (followUp.status === 'done') {
        throw new AppError({
          statusCode: 409,
          code: 'FOLLOW_UP_ALREADY_DONE',
          message: 'Done follow-ups cannot be updated',
        });
      }

      if (followUp.status === 'cancelled') {
        throw new AppError({
          statusCode: 409,
          code: 'FOLLOW_UP_CANCELLED',
          message: 'Cancelled follow-ups cannot be updated',
        });
      }

      const updatingUser = await followUpRepository.findUserById(
        tx,
        data.userId,
      );

      if (!updatingUser) {
        throw new AppError({
          statusCode: 404,
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        });
      }

      if (data.assignedToId !== undefined) {
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
      }

      const updatedFollowUp = await followUpRepository.updateFollowUp(
        tx,
        params.followUpId,
        buildFollowUpUpdateData(data),
      );

      await followUpRepository.createActivity(
        tx,
        buildFollowUpUpdatedActivityData({
          businessId: followUp.businessId,
          userId: data.userId,
          followUpId: followUp.id,
          previousDueDate: followUp.dueDate,
          nextDueDate: updatedFollowUp.dueDate,
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
