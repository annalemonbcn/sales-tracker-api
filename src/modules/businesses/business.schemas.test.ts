import { describe, expect, it } from 'vitest';

import { getBusinessByIdSchema } from './business.schemas.js';

describe('business schemas', () => {
  it('validates getBusinessById params with a valid UUID', () => {
    const result = getBusinessByIdSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects getBusinessById params with an invalid UUID', () => {
    const result = getBusinessByIdSchema.safeParse({
      params: {
        businessId: 'not-a-uuid',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid businessId');
    }
  });
});
