import { AppError } from '../../shared/errors.js';
import { prisma } from '../../shared/prisma.js';
import type {
  CreateBusinessInput,
  GetBusinessesQuery,
} from './business.schemas.js';
import {
  buildBusinessAssignedActivityData,
  buildBusinessCreatedActivityData,
  buildBusinessCreateData,
  buildBusinessWhere,
} from './business.prisma-mapper.js';
import { businessRepository } from './business.repository.js';

export const businessService = {
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
};
