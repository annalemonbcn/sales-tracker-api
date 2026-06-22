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

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>['body'];
export type GetBusinessesQuery = z.infer<typeof getBusinessesSchema>['query'];
