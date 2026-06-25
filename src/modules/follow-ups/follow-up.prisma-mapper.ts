import type { Prisma } from '../../generated/prisma/client.js';
import { ActivityType, FollowUpStatus } from '../../generated/prisma/enums.js';
import type {
  CreateFollowUpInput,
  CreateFollowUpParams,
  GetFollowUpsQuery,
  UpdateFollowUpInput,
} from './follow-up.schemas.js';

export const buildFollowUpCreateData = (
  params: CreateFollowUpParams,
  data: CreateFollowUpInput,
): Prisma.FollowUpUncheckedCreateInput => {
  return {
    businessId: params.businessId,
    assignedToId: data.assignedToId,
    status: FollowUpStatus.pending,
    dueDate: data.dueDate,
    note: data.note ?? null,
  };
};

export const buildFollowUpCreatedActivityData = (params: {
  businessId: string;
  userId: string;
  followUpId: string;
  dueDate: Date;
}): Prisma.ActivityUncheckedCreateInput => {
  return {
    businessId: params.businessId,
    userId: params.userId,
    type: ActivityType.follow_up_created,
    notes: `Follow-up created for ${params.dueDate.toISOString()}`,
    metadata: {
      followUpId: params.followUpId,
      dueDate: params.dueDate.toISOString(),
    },
  };
};

export const shouldUpdateNextFollowUpAt = (params: {
  currentNextFollowUpAt: Date | null;
  newDueDate: Date;
}): boolean => {
  if (!params.currentNextFollowUpAt) {
    return true;
  }

  return params.newDueDate < params.currentNextFollowUpAt;
};

export const buildBusinessNextFollowUpUpdateData = (
  dueDate: Date,
): Prisma.BusinessUpdateInput => {
  return {
    nextFollowUpAt: dueDate,
  };
};

export const buildFollowUpDoneUpdateData = (
  completedAt: Date,
): Prisma.FollowUpUpdateInput => {
  return {
    status: FollowUpStatus.done,
    completedAt,
  };
};

export const buildFollowUpDoneActivityData = (params: {
  businessId: string;
  userId: string;
  followUpId: string;
  completedAt: Date;
}): Prisma.ActivityUncheckedCreateInput => {
  return {
    businessId: params.businessId,
    userId: params.userId,
    type: ActivityType.follow_up_done,
    notes: `Follow-up completed at ${params.completedAt.toISOString()}`,
    metadata: {
      followUpId: params.followUpId,
      completedAt: params.completedAt.toISOString(),
    },
  };
};

export const buildBusinessNextFollowUpRecalculationData = (
  nextFollowUpAt: Date | null,
): Prisma.BusinessUpdateInput => {
  return {
    nextFollowUpAt,
  };
};

export const buildFollowUpCancelUpdateData = (): Prisma.FollowUpUpdateInput => {
  return {
    status: FollowUpStatus.cancelled,
  };
};

export const buildFollowUpCancelledActivityData = (params: {
  businessId: string;
  userId: string;
  followUpId: string;
  cancelledAt: Date;
}): Prisma.ActivityUncheckedCreateInput => {
  return {
    businessId: params.businessId,
    userId: params.userId,
    type: ActivityType.follow_up_cancelled,
    notes: `Follow-up cancelled at ${params.cancelledAt.toISOString()}`,
    metadata: {
      followUpId: params.followUpId,
      cancelledAt: params.cancelledAt.toISOString(),
    },
  };
};

export const buildFollowUpUpdateData = (
  data: UpdateFollowUpInput,
): Prisma.FollowUpUpdateInput => {
  return {
    ...(data.assignedToId !== undefined
      ? {
          assignedTo: {
            connect: {
              id: data.assignedToId,
            },
          },
        }
      : {}),

    ...(data.dueDate !== undefined
      ? {
          dueDate: data.dueDate,
        }
      : {}),

    ...(data.note !== undefined
      ? {
          note: data.note,
        }
      : {}),
  };
};

export const buildFollowUpUpdatedActivityData = (params: {
  businessId: string;
  userId: string;
  followUpId: string;
  previousDueDate: Date;
  nextDueDate: Date;
}): Prisma.ActivityUncheckedCreateInput => {
  return {
    businessId: params.businessId,
    userId: params.userId,
    type: ActivityType.follow_up_updated,
    notes: `Follow-up updated from ${params.previousDueDate.toISOString()} to ${params.nextDueDate.toISOString()}`,
    metadata: {
      followUpId: params.followUpId,
      previousDueDate: params.previousDueDate.toISOString(),
      nextDueDate: params.nextDueDate.toISOString(),
    },
  };
};

export const buildFollowUpWhere = (
  query: GetFollowUpsQuery,
): Prisma.FollowUpWhereInput => {
  return {
    ...(query.status ? { status: query.status } : {}),

    ...(query.assignedToId
      ? {
          assignedToId: query.assignedToId,
        }
      : {}),

    ...(query.businessId
      ? {
          businessId: query.businessId,
        }
      : {}),

    ...(query.priority
      ? {
          business: {
            priority: query.priority,
          },
        }
      : {}),

    ...(query.dueBefore || query.dueAfter
      ? {
          dueDate: {
            ...(query.dueAfter ? { gte: query.dueAfter } : {}),
            ...(query.dueBefore ? { lte: query.dueBefore } : {}),
          },
        }
      : {}),
  };
};
