import type { Prisma } from '../../generated/prisma/client.js';
import { ActivityType, FollowUpStatus } from '../../generated/prisma/enums.js';
import type {
  CreateFollowUpInput,
  CreateFollowUpParams,
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
