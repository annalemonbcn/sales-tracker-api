import type {
  CreateBusinessInput,
  GetBusinessesQuery,
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
