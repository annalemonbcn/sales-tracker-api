import { describe, expect, it } from 'vitest';

import { getBusinessActivitiesSchema } from './activity.schemas.js';

describe('getBusinessActivitiesSchema', () => {
  it('accepts a valid businessId param', () => {
    const result = getBusinessActivitiesSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid businessId param', () => {
    const result = getBusinessActivitiesSchema.safeParse({
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
