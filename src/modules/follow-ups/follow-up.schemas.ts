import { z } from 'zod';

export const getBusinessFollowUpsSchema = z.object({
  params: z.object({
    businessId: z.uuid('Invalid businessId'),
  }),
});

export type GetBusinessFollowUpsParams = z.infer<
  typeof getBusinessFollowUpsSchema
>['params'];
