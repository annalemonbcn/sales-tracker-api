import { z } from 'zod';

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

    category: z.enum([
      'restaurant',
      'hairdresser',
      'beauty_center',
      'hotel',
      'shop',
      'gym',
      'clinic',
      'other',
    ]),

    source: z.enum([
      'instagram',
      'google_maps',
      'walk_in',
      'referral',
      'website',
      'existing_contact',
      'other',
    ]),

    priority: z.enum(['low', 'medium', 'high']).default('medium'),

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

// TODO: unused ??
export type CreateBusinessInput = z.infer<typeof createBusinessSchema>['body'];
