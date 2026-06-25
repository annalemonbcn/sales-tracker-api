import { z } from 'zod';

export const getBusinessFollowUpsSchema = z.object({
  params: z.object({
    businessId: z.uuid('Invalid businessId'),
  }),
});

export type GetBusinessFollowUpsParams = z.infer<
  typeof getBusinessFollowUpsSchema
>['params'];

export const createFollowUpSchema = z.object({
  params: z.object({
    businessId: z.uuid('Invalid businessId'),
  }),

  body: z.object({
    assignedToId: z.uuid('Invalid assignedToId'),

    dueDate: z.iso
      .datetime('Invalid dueDate')
      .transform((value) => new Date(value)),

    note: z.string().trim().min(1, 'Follow-up note is required').optional(),
  }),
});

export type CreateFollowUpParams = z.infer<
  typeof createFollowUpSchema
>['params'];

export type CreateFollowUpInput = z.infer<typeof createFollowUpSchema>['body'];

export const markFollowUpDoneSchema = z.object({
  params: z.object({
    followUpId: z.uuid('Invalid followUpId'),
  }),
});

export type MarkFollowUpDoneParams = z.infer<
  typeof markFollowUpDoneSchema
>['params'];

export const cancelFollowUpSchema = z.object({
  params: z.object({
    followUpId: z.uuid('Invalid followUpId'),
  }),
});

export type CancelFollowUpParams = z.infer<
  typeof cancelFollowUpSchema
>['params'];

export const updateFollowUpSchema = z.object({
  params: z.object({
    followUpId: z.uuid('Invalid followUpId'),
  }),

  body: z
    .object({
      assignedToId: z.uuid('Invalid assignedToId').optional(),

      dueDate: z.iso
        .datetime('Invalid dueDate')
        .transform((value) => new Date(value))
        .optional(),

      note: z.string().trim().min(1, 'Follow-up note is required').optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field is required',
    }),
});

export type UpdateFollowUpParams = z.infer<
  typeof updateFollowUpSchema
>['params'];

export type UpdateFollowUpInput = z.infer<typeof updateFollowUpSchema>['body'];
