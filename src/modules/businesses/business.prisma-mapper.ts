import type {
  CreateBusinessInput,
  GetBusinessesQuery,
  UpdateBusinessInput,
} from './business.schemas.js';
import type { Prisma } from '../../generated/prisma/client.js';

export type InitialBusinessStatus = 'new_lead' | 'assigned';

export const buildBusinessCreateData = (
  data: CreateBusinessInput,
  initialStatus: InitialBusinessStatus,
): Prisma.BusinessCreateInput => ({
  name: data.name,
  category: data.category,
  status: initialStatus,
  source: data.source,
  priority: data.priority,

  instagram: data.instagram ?? null,
  email: data.email ?? null,
  phone: data.phone ?? null,
  website: data.website ?? null,
  address: data.address ?? null,
  notes: data.notes ?? null,

  createdBy: {
    connect: {
      id: data.createdById,
    },
  },

  ...(data.assignedToId
    ? {
        assignedTo: {
          connect: {
            id: data.assignedToId,
          },
        },
      }
    : {}),
});

export const buildBusinessCreatedActivityData = (params: {
  businessId: string;
  userId: string;
}): Prisma.ActivityUncheckedCreateInput => {
  return {
    businessId: params.businessId,
    userId: params.userId,
    type: 'business_created',
    notes: 'Business created',
  };
};

export const buildBusinessAssignedActivityData = (params: {
  businessId: string;
  userId: string;
  assignedToId: string;
}): Prisma.ActivityUncheckedCreateInput => {
  return {
    businessId: params.businessId,
    userId: params.userId,
    type: 'business_assigned',
    notes: `Business assigned to user ${params.assignedToId}`,
    metadata: {
      assignedToId: params.assignedToId,
    },
  };
};

export const buildStatusChangedActivityData = (params: {
  businessId: string;
  userId: string;
  previousStatus: string;
  nextStatus: string;
}): Prisma.ActivityUncheckedCreateInput => {
  return {
    businessId: params.businessId,
    userId: params.userId,
    type: 'status_changed',
    notes: `Status changed from ${params.previousStatus} to ${params.nextStatus}`,
    metadata: {
      previousStatus: params.previousStatus,
      nextStatus: params.nextStatus,
    },
  };
};

export const buildPriorityChangedActivityData = (params: {
  businessId: string;
  userId: string;
  previousPriority: string;
  nextPriority: string;
}): Prisma.ActivityUncheckedCreateInput => {
  return {
    businessId: params.businessId,
    userId: params.userId,
    type: 'priority_changed',
    notes: `Priority changed from ${params.previousPriority} to ${params.nextPriority}`,
    metadata: {
      previousPriority: params.previousPriority,
      nextPriority: params.nextPriority,
    },
  };
};

export const buildBusinessWhere = (
  query: GetBusinessesQuery,
): Prisma.BusinessWhereInput => {
  return {
    ...(query.status ? { status: query.status } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(query.priority ? { priority: query.priority } : {}),
    ...(query.source ? { source: query.source } : {}),
    ...(query.assignedToId ? { assignedToId: query.assignedToId } : {}),

    ...(query.search
      ? {
          OR: [
            {
              name: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
            {
              instagram: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
            {
              phone: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
            {
              address: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {}),
  };
};

export const buildBusinessUpdateData = (
  data: UpdateBusinessInput,
): Prisma.BusinessUpdateInput => {
  return {
    ...(data.name !== undefined ? { name: data.name } : {}),
    ...(data.category !== undefined ? { category: data.category } : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
    ...(data.source !== undefined ? { source: data.source } : {}),
    ...(data.priority !== undefined ? { priority: data.priority } : {}),

    ...(data.instagram !== undefined ? { instagram: data.instagram } : {}),
    ...(data.email !== undefined ? { email: data.email } : {}),
    ...(data.phone !== undefined ? { phone: data.phone } : {}),
    ...(data.website !== undefined ? { website: data.website } : {}),
    ...(data.address !== undefined ? { address: data.address } : {}),
    ...(data.notes !== undefined ? { notes: data.notes } : {}),

    ...(data.assignedToId !== undefined
      ? data.assignedToId === null
        ? {
            assignedTo: {
              disconnect: true,
            },
          }
        : {
            assignedTo: {
              connect: {
                id: data.assignedToId,
              },
            },
          }
      : {}),
  };
};
