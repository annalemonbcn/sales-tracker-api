import { describe, expect, it } from 'vitest';

import {
  createActivitySchema,
  getBusinessActivitiesSchema,
} from './activity.schemas.js';

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

describe('createActivitySchema', () => {
  it('accepts a valid manual activity', () => {
    const result = createActivitySchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        type: 'instagram_message_sent',
        userId: '660e8400-e29b-41d4-a716-446655440000',
        notes: 'Le he escrito por Instagram.',
        metadata: {
          channel: 'instagram',
          attempts: 1,
          replied: false,
        },
      },
    });

    expect(result.success).toBe(true);
  });

  it('accepts a valid manual activity without notes and metadata', () => {
    const result = createActivitySchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        type: 'phone_call_done',
        userId: '660e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects a system activity type', () => {
    const result = createActivitySchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        type: 'business_created',
        userId: '660e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['body', 'type']);
    }
  });

  it('rejects an invalid userId', () => {
    const result = createActivitySchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        type: 'email_sent',
        userId: 'not-a-uuid',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Invalid userId');
    }
  });

  it('rejects empty notes when notes are provided', () => {
    const result = createActivitySchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        type: 'note_added',
        userId: '660e8400-e29b-41d4-a716-446655440000',
        notes: '',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Activity notes are required',
      );
    }
  });

  it('accepts nested JSON metadata', () => {
    const result = createActivitySchema.safeParse({
      params: {
        businessId: '550e8400-e29b-41d4-a716-446655440000',
      },
      body: {
        type: 'response_received',
        userId: '660e8400-e29b-41d4-a716-446655440000',
        metadata: {
          sentiment: 'positive',
          tags: ['interested', 'needs_follow_up'],
          details: {
            wantsDossier: true,
            score: 8,
          },
        },
      },
    });

    expect(result.success).toBe(true);
  });
});
