import { describe, expect, it } from 'vitest';

import { toActivityDto } from './activity.mapper.js';

describe('toActivityDto', () => {
  it('maps a Prisma activity with user to a public ActivityDto', () => {
    const createdAt = new Date('2026-06-23T10:00:00.000Z');

    const activity = {
      id: 'activity-id',
      businessId: 'business-id',
      userId: 'user-id',
      type: 'priority_changed',
      notes: 'Priority changed from medium to high',
      metadata: {
        previousPriority: 'medium',
        nextPriority: 'high',
      },
      createdAt,
      user: {
        id: 'user-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: 'admin',
      },
    } as const;

    expect(toActivityDto(activity)).toEqual({
      id: 'activity-id',
      type: 'priority_changed',
      notes: 'Priority changed from medium to high',
      metadata: {
        previousPriority: 'medium',
        nextPriority: 'high',
      },
      user: {
        id: 'user-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: 'admin',
      },
      createdAt,
    });
  });

  it('maps metadata as null when activity has no metadata', () => {
    const createdAt = new Date('2026-06-23T10:00:00.000Z');

    const activity = {
      id: 'activity-id',
      businessId: 'business-id',
      userId: 'user-id',
      type: 'business_created',
      notes: 'Business created',
      metadata: null,
      createdAt,
      user: {
        id: 'user-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: 'admin',
      },
    } as const;

    expect(toActivityDto(activity)).toEqual({
      id: 'activity-id',
      type: 'business_created',
      notes: 'Business created',
      metadata: null,
      user: {
        id: 'user-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: 'admin',
      },
      createdAt,
    });
  });
});
