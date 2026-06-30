import { describe, expect, it } from 'vitest';

import {
  createBusinessSchema,
  getBusinessByIdSchema,
  getBusinessesSchema,
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

  it('transforms empty optional text fields to undefined when creating a business', () => {
    const result = createBusinessSchema.safeParse({
      body: {
        name: 'Test Business',
        category: 'restaurant',
        source: 'instagram',
        instagram: '',
        phone: '   ',
        address: '',
        notes: '',
        createdById: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data.body).toEqual({
      name: 'Test Business',
      category: 'restaurant',
      source: 'instagram',
      priority: 'medium',
      createdById: '550e8400-e29b-41d4-a716-446655440000',
    });
  });

  it('transforms empty optional text fields to null when updating a business', () => {
    const result = updateBusinessSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        instagram: '',
        phone: '   ',
        address: '',
        notes: '',
      },
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data.body).toEqual({
      instagram: null,
      phone: null,
      address: null,
      notes: null,
    });
  });

  it('trims optional text fields when creating a business', () => {
    const result = createBusinessSchema.safeParse({
      body: {
        name: 'Test Business',
        category: 'restaurant',
        source: 'instagram',
        instagram: '  @test_business  ',
        phone: '  +34 600 000 000  ',
        address: '  Barcelona  ',
        notes: '  Some notes  ',
        createdById: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data.body.instagram).toBe('@test_business');
    expect(result.data.body.phone).toBe('+34 600 000 000');
    expect(result.data.body.address).toBe('Barcelona');
    expect(result.data.body.notes).toBe('Some notes');
  });

  it('trims optional text fields when updating a business', () => {
    const result = updateBusinessSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        instagram: '  @updated_business  ',
        phone: '  +34 611 111 111  ',
        address: '  Barcelona  ',
        notes: '  Updated notes  ',
      },
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data.body).toEqual({
      instagram: '@updated_business',
      phone: '+34 611 111 111',
      address: 'Barcelona',
      notes: 'Updated notes',
    });
  });

  it('transforms empty email and website to null when updating a business', () => {
    const result = updateBusinessSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        email: '',
        website: '   ',
      },
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data.body).toEqual({
      email: null,
      website: null,
    });
  });

  it('transforms empty email and website to undefined when creating a business', () => {
    const result = createBusinessSchema.safeParse({
      body: {
        name: 'Test Business',
        category: 'restaurant',
        source: 'instagram',
        email: '',
        website: '   ',
        createdById: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data.body).toEqual({
      name: 'Test Business',
      category: 'restaurant',
      source: 'instagram',
      priority: 'medium',
      createdById: '550e8400-e29b-41d4-a716-446655440000',
    });
  });

  it('accepts assignedToId as a valid user id in get businesses query', () => {
    const result = getBusinessesSchema.safeParse({
      query: {
        assignedToId: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(true);
  });

  it('accepts assignedToId as unassigned in get businesses query', () => {
    const result = getBusinessesSchema.safeParse({
      query: {
        assignedToId: 'unassigned',
      },
    });

    expect(result.success).toBe(true);
  });

  it('accepts assignedToId null in get businesses query', () => {
    const result = getBusinessesSchema.safeParse({
      query: {
        assignedToId: null,
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid assignedToId in get businesses query', () => {
    const result = getBusinessesSchema.safeParse({
      query: {
        assignedToId: 'invalid-user-id',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid assignedToId');
    }
  });
});
