import { describe, expect, it } from 'vitest';

import {
  cancelFollowUpSchema,
  createFollowUpSchema,
  getBusinessFollowUpsSchema,
  getFollowUpsSchema,
  markFollowUpDoneSchema,
  updateFollowUpSchema,
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

describe('markFollowUpDoneSchema', () => {
  it('accepts a valid followUpId param', () => {
    const result = markFollowUpDoneSchema.safeParse({
      params: {
        followUpId: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid followUpId param', () => {
    const result = markFollowUpDoneSchema.safeParse({
      params: {
        followUpId: 'not-a-uuid',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid followUpId');
    }
  });
});

describe('cancelFollowUpSchema', () => {
  it('accepts a valid followUpId param', () => {
    const result = cancelFollowUpSchema.safeParse({
      params: {
        followUpId: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid followUpId param', () => {
    const result = cancelFollowUpSchema.safeParse({
      params: {
        followUpId: 'not-a-uuid',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid followUpId');
    }
  });
});

describe('updateFollowUpSchema', () => {
  it('accepts a valid dueDate update', () => {
    const result = updateFollowUpSchema.safeParse({
      params: {
        followUpId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        dueDate: '2026-07-05T10:00:00.000Z',
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.body.dueDate).toBeInstanceOf(Date);
    }
  });

  it('accepts a valid assignedToId update', () => {
    const result = updateFollowUpSchema.safeParse({
      params: {
        followUpId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        assignedToId: '660e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(true);
  });

  it('accepts a valid note update', () => {
    const result = updateFollowUpSchema.safeParse({
      params: {
        followUpId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        note: 'Call the business next week.',
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.body.note).toBe('Call the business next week.');
    }
  });

  it('trims note before returning the parsed body', () => {
    const result = updateFollowUpSchema.safeParse({
      params: {
        followUpId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        note: '  Call the business next week.  ',
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.body.note).toBe('Call the business next week.');
    }
  });

  it('accepts updating several allowed fields at once', () => {
    const result = updateFollowUpSchema.safeParse({
      params: {
        followUpId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        assignedToId: '660e8400-e29b-41d4-a716-446655440000',
        dueDate: '2026-07-05T10:00:00.000Z',
        note: 'Visit the business in person.',
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.body.dueDate).toBeInstanceOf(Date);
    }
  });

  it('rejects an empty update body', () => {
    const result = updateFollowUpSchema.safeParse({
      params: {
        followUpId: '550e8400-e29b-41d4-a716-446655440000',
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

  it('rejects an invalid followUpId param', () => {
    const result = updateFollowUpSchema.safeParse({
      params: {
        followUpId: 'not-a-uuid',
      },
      body: {
        note: 'Call next week.',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid followUpId');
    }
  });

  it('rejects an invalid assignedToId', () => {
    const result = updateFollowUpSchema.safeParse({
      params: {
        followUpId: '550e8400-e29b-41d4-a716-446655440000',
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

  it('rejects an invalid dueDate', () => {
    const result = updateFollowUpSchema.safeParse({
      params: {
        followUpId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        dueDate: 'not-a-date',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid dueDate');
    }
  });

  it('rejects an empty note when note is provided', () => {
    const result = updateFollowUpSchema.safeParse({
      params: {
        followUpId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
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
});

describe('getFollowUpsSchema', () => {
  it('accepts empty query params', () => {
    const result = getFollowUpsSchema.safeParse({
      query: {},
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.query).toEqual({});
    }
  });

  it('accepts a valid status filter', () => {
    const result = getFollowUpsSchema.safeParse({
      query: {
        status: 'pending',
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.query.status).toBe('pending');
    }
  });

  it('accepts a valid assignedToId filter', () => {
    const result = getFollowUpsSchema.safeParse({
      query: {
        assignedToId: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(true);
  });

  it('accepts a valid dueBefore filter and transforms it to Date', () => {
    const result = getFollowUpsSchema.safeParse({
      query: {
        dueBefore: '2026-07-10T00:00:00.000Z',
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.query.dueBefore).toBeInstanceOf(Date);
      expect(result.data.query.dueBefore?.toISOString()).toBe(
        '2026-07-10T00:00:00.000Z',
      );
    }
  });

  it('accepts a valid dueAfter filter and transforms it to Date', () => {
    const result = getFollowUpsSchema.safeParse({
      query: {
        dueAfter: '2026-07-01T00:00:00.000Z',
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.query.dueAfter).toBeInstanceOf(Date);
      expect(result.data.query.dueAfter?.toISOString()).toBe(
        '2026-07-01T00:00:00.000Z',
      );
    }
  });

  it('accepts several filters at once', () => {
    const result = getFollowUpsSchema.safeParse({
      query: {
        status: 'pending',
        assignedToId: '550e8400-e29b-41d4-a716-446655440000',
        businessId: '660e8400-e29b-41d4-a716-446655440000',
        priority: 'high',
        dueAfter: '2026-07-01T00:00:00.000Z',
        dueBefore: '2026-07-10T00:00:00.000Z',
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.query).toEqual({
        status: 'pending',
        assignedToId: '550e8400-e29b-41d4-a716-446655440000',
        businessId: '660e8400-e29b-41d4-a716-446655440000',
        priority: 'high',
        dueAfter: new Date('2026-07-01T00:00:00.000Z'),
        dueBefore: new Date('2026-07-10T00:00:00.000Z'),
      });
    }
  });

  it('accepts several filters at once', () => {
    const result = getFollowUpsSchema.safeParse({
      query: {
        status: 'pending',
        assignedToId: '550e8400-e29b-41d4-a716-446655440000',
        dueAfter: '2026-07-01T00:00:00.000Z',
        dueBefore: '2026-07-10T00:00:00.000Z',
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.query).toEqual({
        status: 'pending',
        assignedToId: '550e8400-e29b-41d4-a716-446655440000',
        dueAfter: new Date('2026-07-01T00:00:00.000Z'),
        dueBefore: new Date('2026-07-10T00:00:00.000Z'),
      });
    }
  });

  it('rejects an invalid status filter', () => {
    const result = getFollowUpsSchema.safeParse({
      query: {
        status: 'invalid-status',
      },
    });

    expect(result.success).toBe(false);
  });

  it('rejects an invalid assignedToId filter', () => {
    const result = getFollowUpsSchema.safeParse({
      query: {
        assignedToId: 'not-a-uuid',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid assignedToId');
    }
  });

  it('rejects an invalid dueBefore filter', () => {
    const result = getFollowUpsSchema.safeParse({
      query: {
        dueBefore: 'not-a-date',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid dueBefore');
    }
  });

  it('rejects an invalid dueAfter filter', () => {
    const result = getFollowUpsSchema.safeParse({
      query: {
        dueAfter: 'not-a-date',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid dueAfter');
    }
  });

  it('accepts a valid businessId filter', () => {
    const result = getFollowUpsSchema.safeParse({
      query: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.query.businessId).toBe(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    }
  });

  it('rejects an invalid businessId filter', () => {
    const result = getFollowUpsSchema.safeParse({
      query: {
        businessId: 'not-a-uuid',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid businessId');
    }
  });

  it('accepts a valid priority filter', () => {
    const result = getFollowUpsSchema.safeParse({
      query: {
        priority: 'high',
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.query.priority).toBe('high');
    }
  });

  it('rejects an invalid priority filter', () => {
    const result = getFollowUpsSchema.safeParse({
      query: {
        priority: 'urgent',
      },
    });

    expect(result.success).toBe(false);
  });
});
