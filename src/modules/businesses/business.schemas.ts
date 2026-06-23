import { z } from 'zod';
import {
  BusinessStatus,
  Category,
  LeadSource,
  Priority,
} from '../../generated/prisma/enums.js';

const optionalTextField = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue === '' ? undefined : trimmedValue;
}, z.string().optional());

export const createBusinessSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Business name is required'),

    category: z.enum(Category),

    source: z.enum(LeadSource),

    priority: z.enum(Priority).default('medium'),

    instagram: optionalTextField,
    phone: optionalTextField,
    address: optionalTextField,
    notes: optionalTextField,

    email: z.email('Invalid email').optional(),
    website: z.url('Invalid website URL').optional(),

    createdById: z.uuid('Invalid createdById'),
    assignedToId: z.uuid('Invalid assignedToId').optional(),
  }),
});

export const getBusinessByIdSchema = z.object({
  params: z.object({
    businessId: z.uuid('Invalid businessId'),
  }),
});

export const getBusinessesSchema = z.object({
  query: z.object({
    status: z.enum(BusinessStatus).optional(),

    category: z.enum(Category).optional(),

    priority: z.enum(Priority).optional(),

    source: z.enum(LeadSource).optional(),

    assignedToId: z.uuid('Invalid assignedToId').optional(),

    search: z.string().trim().min(1).optional(),
  }),
});

export const updateBusinessSchema = z.object({
  params: z.object({
    businessId: z.uuid('Invalid businessId'),
  }),

  body: z
    .object({
      name: z.string().trim().min(1, 'Business name is required').optional(),

      category: z.enum(Category).optional(),

      status: z.enum(BusinessStatus).optional(),

      source: z.enum(LeadSource).optional(),

      priority: z.enum(Priority).optional(),

      instagram: optionalTextField,
      phone: optionalTextField,
      address: optionalTextField,
      notes: optionalTextField,

      email: z.email('Invalid email').optional(),
      website: z.url('Invalid website URL').optional(),

      assignedToId: z.uuid('Invalid assignedToId').nullable().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field is required',
    }),
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>['body'];

export type GetBusinessesQuery = z.infer<typeof getBusinessesSchema>['query'];

export type GetBusinessByIdParams = z.infer<
  typeof getBusinessByIdSchema
>['params'];

export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>['body'];

export type UpdateBusinessParams = z.infer<
  typeof updateBusinessSchema
>['params'];
