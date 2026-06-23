import type { Prisma } from '../../generated/prisma/client.js';
import type {
  CreateActivityInput,
  CreateActivityParams,
} from './activity.schemas.js';

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
