import { describe, expect, it } from 'vitest';

import {
  getBusinessByIdSchema,
  updateBusinessSchema,
} from './business.schemas.js';

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

  it('rejects an empty update body', () => {
    const result = updateBusinessSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {},
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'At least one field is required',
      );
    }
  });

  it('accepts a valid status update', () => {
    const result = updateBusinessSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        status: 'interested',
      },
    });

    expect(result.success).toBe(true);
  });

  it('accepts a valid priority update', () => {
    const result = updateBusinessSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        priority: 'high',
      },
    });

    expect(result.success).toBe(true);
  });

  it('accepts assignedToId null to unassign a business', () => {
    const result = updateBusinessSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        assignedToId: null,
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid assignedToId', () => {
    const result = updateBusinessSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        assignedToId: 'not-a-uuid',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid assignedToId');
    }
  });

  it('rejects an invalid businessId param', () => {
    const result = updateBusinessSchema.safeParse({
      params: {
        businessId: 'not-a-uuid',
      },
      body: {
        priority: 'high',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid businessId');
    }
  });
});
