import { z } from 'zod';

export const getBusinessActivitiesSchema = z.object({
  params: z.object({
    businessId: z.uuid('Invalid businessId'),
  }),
});

export type GetBusinessActivitiesParams = z.infer<
  typeof getBusinessActivitiesSchema
>['params'];
