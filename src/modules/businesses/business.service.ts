import { AppError } from '../../shared/errors.js';
import { prisma } from '../../shared/prisma.js';
import type {
  CreateBusinessInput,
  GetBusinessByIdParams,
  GetBusinessesQuery,
  UpdateBusinessInput,
  UpdateBusinessParams,
} from './business.schemas.js';
import {
  buildBusinessAssignedActivityData,
  buildBusinessCreatedActivityData,
  buildBusinessCreateData,
  buildBusinessUpdateData,
  buildBusinessWhere,
  buildPriorityChangedActivityData,
  buildStatusChangedActivityData,
} from './business.prisma-mapper.js';
import { businessRepository } from './business.repository.js';

export const businessService = {
  getBusinessById: async (params: GetBusinessByIdParams) => {
    return prisma.$transaction(async (tx) => {
      const business = await businessRepository.findBusinessActivitiesById(
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

      return business;
    });
  },

  getBusinesses: async (query: GetBusinessesQuery) => {
    return prisma.$transaction(async (tx) => {
      const where = buildBusinessWhere(query);

      return businessRepository.findManyBusinesses(tx, where);
    });
  },

  createBusiness: async (data: CreateBusinessInput) => {
    return prisma.$transaction(async (tx) => {
      const createdByUser = await businessRepository.findUserById(
        tx,
        data.createdById,
      );

      if (!createdByUser) {
        throw new AppError({
          statusCode: 404,
          code: 'CREATED_BY_USER_NOT_FOUND',
          message: 'The user creating this business does not exist',
        });
      }

      if (data.assignedToId) {
        const assignedUser = await businessRepository.findUserById(
          tx,
          data.assignedToId,
        );

        if (!assignedUser) {
          throw new AppError({
            statusCode: 404,
            code: 'ASSIGNED_USER_NOT_FOUND',
            message: 'The assigned user does not exist',
          });
        }
      }

      const initialStatus = data.assignedToId ? 'assigned' : 'new_lead';

      const business = await businessRepository.createBusiness(
        tx,
        buildBusinessCreateData(data, initialStatus),
      );

      await businessRepository.createActivity(
        tx,
        buildBusinessCreatedActivityData({
          businessId: business.id,
          userId: data.createdById,
        }),
      );

      if (data.assignedToId) {
        await businessRepository.createActivity(
          tx,
          buildBusinessAssignedActivityData({
            businessId: business.id,
            userId: data.createdById,
            assignedToId: data.assignedToId,
          }),
        );
      }

      return business;
    });
  },

  updateBusiness: async (
    params: UpdateBusinessParams,
    data: UpdateBusinessInput,
  ) => {
    return prisma.$transaction(async (tx) => {
      const existingBusiness = await businessRepository.findBusinessById(
        tx,
        params.businessId,
      );

      if (!existingBusiness) {
        throw new AppError({
          statusCode: 404,
          code: 'BUSINESS_NOT_FOUND',
          message: 'Business not found',
        });
      }

      if (data.assignedToId) {
        const assignedUser = await businessRepository.findUserById(
          tx,
          data.assignedToId,
        );

        if (!assignedUser) {
          throw new AppError({
            statusCode: 404,
            code: 'ASSIGNED_USER_NOT_FOUND',
            message: 'The assigned user does not exist',
          });
        }
      }

      const updatedBusiness = await businessRepository.updateBusiness(
        tx,
        params.businessId,
        buildBusinessUpdateData(data),
      );

      if (
        data.status !== undefined &&
        data.status !== existingBusiness.status
      ) {
        await businessRepository.createActivity(
          tx,
          buildStatusChangedActivityData({
            businessId: existingBusiness.id,
            userId: existingBusiness.createdById,
            previousStatus: existingBusiness.status,
            nextStatus: data.status,
          }),
        );
      }

      if (
        data.priority !== undefined &&
        data.priority !== existingBusiness.priority
      ) {
        await businessRepository.createActivity(
          tx,
          buildPriorityChangedActivityData({
            businessId: existingBusiness.id,
            userId: existingBusiness.createdById,
            previousPriority: existingBusiness.priority,
            nextPriority: data.priority,
          }),
        );
      }

      if (
        data.assignedToId !== undefined &&
        data.assignedToId !== null &&
        data.assignedToId !== existingBusiness.assignedToId
      ) {
        await businessRepository.createActivity(
          tx,
          buildBusinessAssignedActivityData({
            businessId: existingBusiness.id,
            userId: existingBusiness.createdById,
            assignedToId: data.assignedToId,
          }),
        );
      }

      return updatedBusiness;
    });
  },
};
