import {
  ActivityType,
  BusinessStatus,
  type Prisma,
} from '../../generated/prisma/client.js';
import type {
  CreateActivityInput,
  CreateActivityParams,
} from './activity.schemas.js';

const contactActivityTypes = [
  ActivityType.instagram_message_sent,
  ActivityType.email_sent,
  ActivityType.phone_call_done,
  ActivityType.visit_done,
] as const;

const statusByActivityType = {
  [ActivityType.instagram_message_sent]: BusinessStatus.waiting_response,
  [ActivityType.email_sent]: BusinessStatus.waiting_response,
  [ActivityType.dossier_sent]: BusinessStatus.dossier_sent,
  [ActivityType.meeting_scheduled]: BusinessStatus.meeting_scheduled,
  [ActivityType.meeting_done]: BusinessStatus.meeting_done,
  [ActivityType.proposal_sent]: BusinessStatus.proposal_sent,
  [ActivityType.response_received]: BusinessStatus.interested,
} as const;

export const buildManualActivityCreateData = (
  params: CreateActivityParams,
  data: CreateActivityInput,
): Prisma.ActivityUncheckedCreateInput => {
  return {
    businessId: params.businessId,
    userId: data.userId,
    type: data.type,
    notes: data.notes ?? null,

    ...(data.metadata !== undefined
      ? {
          metadata: data.metadata,
        }
      : {}),
  };
};

export const shouldUpdateLastContactedAt = (type: ActivityType): boolean => {
  return contactActivityTypes.includes(
    type as (typeof contactActivityTypes)[number],
  );
};

export const getNextStatusFromActivityType = (
  type: ActivityType,
): BusinessStatus | undefined => {
  return statusByActivityType[type as keyof typeof statusByActivityType];
};

export const buildBusinessUpdateDataFromActivity = (params: {
  type: ActivityType;
  contactedAt: Date;
}): Prisma.BusinessUpdateInput => {
  const nextStatus = getNextStatusFromActivityType(params.type);

  return {
    ...(shouldUpdateLastContactedAt(params.type)
      ? {
          lastContactedAt: params.contactedAt,
        }
      : {}),

    ...(nextStatus !== undefined
      ? {
          status: nextStatus,
        }
      : {}),
  };
};
