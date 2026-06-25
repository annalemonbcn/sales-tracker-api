import { describe, expect, it } from 'vitest';

import { ActivityType, FollowUpStatus } from '../../generated/prisma/enums.js';
import {
  buildBusinessNextFollowUpUpdateData,
  buildFollowUpCreateData,
  buildFollowUpCreatedActivityData,
  shouldUpdateNextFollowUpAt,
} from './follow-up.prisma-mapper.js';

describe('buildFollowUpCreateData', () => {
  it('builds Prisma create data for a follow-up with note', () => {
    const dueDate = new Date('2026-07-05T10:00:00.000Z');

    const result = buildFollowUpCreateData(
      {
        businessId: 'business-id',
      },
      {
        assignedToId: 'user-id',
        dueDate,
        note: 'Call the business.',
      },
    );

    expect(result).toEqual({
      businessId: 'business-id',
      assignedToId: 'user-id',
      status: FollowUpStatus.pending,
      dueDate,
      note: 'Call the business.',
    });
  });

  it('builds Prisma create data with note as null when note is not provided', () => {
    const dueDate = new Date('2026-07-05T10:00:00.000Z');

    const result = buildFollowUpCreateData(
      {
        businessId: 'business-id',
      },
      {
        assignedToId: 'user-id',
        dueDate,
      },
    );

    expect(result).toEqual({
      businessId: 'business-id',
      assignedToId: 'user-id',
      status: FollowUpStatus.pending,
      dueDate,
      note: null,
    });
  });
});

describe('buildFollowUpCreatedActivityData', () => {
  it('builds activity data for follow_up_created', () => {
    const dueDate = new Date('2026-07-05T10:00:00.000Z');

    const result = buildFollowUpCreatedActivityData({
      businessId: 'business-id',
      userId: 'user-id',
      followUpId: 'follow-up-id',
      dueDate,
    });

    expect(result).toEqual({
      businessId: 'business-id',
      userId: 'user-id',
      type: ActivityType.follow_up_created,
      notes: 'Follow-up created for 2026-07-05T10:00:00.000Z',
      metadata: {
        followUpId: 'follow-up-id',
        dueDate: '2026-07-05T10:00:00.000Z',
      },
    });
  });
});

describe('shouldUpdateNextFollowUpAt', () => {
  it('returns true when current nextFollowUpAt is null', () => {
    const result = shouldUpdateNextFollowUpAt({
      currentNextFollowUpAt: null,
      newDueDate: new Date('2026-07-05T10:00:00.000Z'),
    });

    expect(result).toBe(true);
  });

  it('returns true when new dueDate is earlier than current nextFollowUpAt', () => {
    const result = shouldUpdateNextFollowUpAt({
      currentNextFollowUpAt: new Date('2026-07-10T10:00:00.000Z'),
      newDueDate: new Date('2026-07-05T10:00:00.000Z'),
    });

    expect(result).toBe(true);
  });

  it('returns false when new dueDate is later than current nextFollowUpAt', () => {
    const result = shouldUpdateNextFollowUpAt({
      currentNextFollowUpAt: new Date('2026-07-05T10:00:00.000Z'),
      newDueDate: new Date('2026-07-10T10:00:00.000Z'),
    });

    expect(result).toBe(false);
  });

  it('returns false when new dueDate is equal to current nextFollowUpAt', () => {
    const result = shouldUpdateNextFollowUpAt({
      currentNextFollowUpAt: new Date('2026-07-05T10:00:00.000Z'),
      newDueDate: new Date('2026-07-05T10:00:00.000Z'),
    });

    expect(result).toBe(false);
  });
});

describe('buildBusinessNextFollowUpUpdateData', () => {
  it('builds Prisma update data for business nextFollowUpAt', () => {
    const dueDate = new Date('2026-07-05T10:00:00.000Z');

    const result = buildBusinessNextFollowUpUpdateData(dueDate);

    expect(result).toEqual({
      nextFollowUpAt: dueDate,
    });
  });
});
