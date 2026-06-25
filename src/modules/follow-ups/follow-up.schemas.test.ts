import { describe, expect, it } from 'vitest';

import {
  createFollowUpSchema,
  getBusinessFollowUpsSchema,
} from './follow-up.schemas.js';

describe('getBusinessFollowUpsSchema', () => {
  it('accepts a valid businessId param', () => {
    const result = getBusinessFollowUpsSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid businessId param', () => {
    const result = getBusinessFollowUpsSchema.safeParse({
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

describe('createFollowUpSchema', () => {
  it('accepts a valid follow-up creation payload', () => {
    const result = createFollowUpSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        assignedToId: '660e8400-e29b-41d4-a716-446655440000',
        dueDate: '2026-07-05T10:00:00.000Z',
        note: 'Call the business to check if they received the dossier.',
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.body.dueDate).toBeInstanceOf(Date);
      expect(result.data.body.dueDate.toISOString()).toBe(
        '2026-07-05T10:00:00.000Z',
      );
    }
  });

  it('accepts a valid follow-up creation payload without note', () => {
    const result = createFollowUpSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        assignedToId: '660e8400-e29b-41d4-a716-446655440000',
        dueDate: '2026-07-05T10:00:00.000Z',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid businessId param', () => {
    const result = createFollowUpSchema.safeParse({
      params: {
        businessId: 'not-a-uuid',
      },
      body: {
        assignedToId: '660e8400-e29b-41d4-a716-446655440000',
        dueDate: '2026-07-05T10:00:00.000Z',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid businessId');
    }
  });

  it('rejects an invalid assignedToId', () => {
    const result = createFollowUpSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        assignedToId: 'not-a-uuid',
        dueDate: '2026-07-05T10:00:00.000Z',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid assignedToId');
    }
  });

  it('rejects an invalid dueDate', () => {
    const result = createFollowUpSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        assignedToId: '660e8400-e29b-41d4-a716-446655440000',
        dueDate: 'not-a-date',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid dueDate');
    }
  });

  it('rejects empty note when note is provided', () => {
    const result = createFollowUpSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        assignedToId: '660e8400-e29b-41d4-a716-446655440000',
        dueDate: '2026-07-05T10:00:00.000Z',
        note: '',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Follow-up note is required',
      );
    }
  });

  it('trims note when note is provided', () => {
    const result = createFollowUpSchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        assignedToId: '660e8400-e29b-41d4-a716-446655440000',
        dueDate: '2026-07-05T10:00:00.000Z',
        note: '   Call the business   ',
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.body.note).toBe('Call the business');
    }
  });
});
