import { z } from 'zod';
import { ActivityType } from '../../generated/prisma/enums.js';
import type { Prisma } from '../../generated/prisma/client.js';

const jsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

const manualActivityTypes = [
  ActivityType.instagram_message_sent,
  ActivityType.email_sent,
  ActivityType.phone_call_done,
  ActivityType.visit_done,
  ActivityType.response_received,
  ActivityType.dossier_sent,
  ActivityType.meeting_scheduled,
  ActivityType.meeting_done,
  ActivityType.proposal_sent,
  ActivityType.note_added,
] as const;

export const getBusinessActivitiesSchema = z.object({
  params: z.object({
    businessId: z.uuid('Invalid businessId'),
  }),
});

export type GetBusinessActivitiesParams = z.infer<
  typeof getBusinessActivitiesSchema
>['params'];

export const createActivitySchema = z.object({
  params: z.object({
    businessId: z.uuid('Invalid businessId'),
  }),

  body: z.object({
    type: z.enum(manualActivityTypes),

    userId: z.uuid('Invalid userId'),

    notes: z.string().trim().min(1, 'Activity notes are required').optional(),

    metadata: z.record(z.string(), jsonValueSchema).optional(),
  }),
});

export type CreateActivityParams = z.infer<
  typeof createActivitySchema
>['params'];

export type CreateActivityInput = z.infer<typeof createActivitySchema>['body'];
