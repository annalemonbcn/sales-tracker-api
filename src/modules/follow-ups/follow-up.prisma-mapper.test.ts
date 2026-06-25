import { describe, expect, it } from 'vitest';

import { ActivityType, FollowUpStatus } from '../../generated/prisma/enums.js';
import {
  buildBusinessNextFollowUpRecalculationData,
  buildBusinessNextFollowUpUpdateData,
  buildFollowUpCancelUpdateData,
  buildFollowUpCancelledActivityData,
  buildFollowUpCreateData,
  buildFollowUpCreatedActivityData,
  buildFollowUpDoneActivityData,
  buildFollowUpDoneUpdateData,
  buildFollowUpUpdateData,
  buildFollowUpUpdatedActivityData,
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

describe('buildFollowUpDoneUpdateData', () => {
  it('builds Prisma update data to mark a follow-up as done', () => {
    const completedAt = new Date('2026-07-05T11:00:00.000Z');

    const result = buildFollowUpDoneUpdateData(completedAt);

    expect(result).toEqual({
      status: FollowUpStatus.done,
      completedAt,
    });
  });
});

describe('buildFollowUpDoneActivityData', () => {
  it('builds activity data for follow_up_done', () => {
    const completedAt = new Date('2026-07-05T11:00:00.000Z');

    const result = buildFollowUpDoneActivityData({
      businessId: 'business-id',
      userId: 'user-id',
      followUpId: 'follow-up-id',
      completedAt,
    });

    expect(result).toEqual({
      businessId: 'business-id',
      userId: 'user-id',
      type: ActivityType.follow_up_done,
      notes: 'Follow-up completed at 2026-07-05T11:00:00.000Z',
      metadata: {
        followUpId: 'follow-up-id',
        completedAt: '2026-07-05T11:00:00.000Z',
      },
    });
  });
});

describe('buildBusinessNextFollowUpRecalculationData', () => {
  it('builds Prisma update data with the next pending follow-up date', () => {
    const nextFollowUpAt = new Date('2026-07-10T10:00:00.000Z');

    const result = buildBusinessNextFollowUpRecalculationData(nextFollowUpAt);

    expect(result).toEqual({
      nextFollowUpAt,
    });
  });

  it('builds Prisma update data with nextFollowUpAt as null when there are no pending follow-ups', () => {
    const result = buildBusinessNextFollowUpRecalculationData(null);

    expect(result).toEqual({
      nextFollowUpAt: null,
    });
  });
});

describe('buildFollowUpCancelUpdateData', () => {
  it('builds Prisma update data to cancel a follow-up', () => {
    const result = buildFollowUpCancelUpdateData();

    expect(result).toEqual({
      status: FollowUpStatus.cancelled,
    });
  });
});

describe('buildFollowUpCancelledActivityData', () => {
  it('builds activity data for follow_up_cancelled', () => {
    const cancelledAt = new Date('2026-07-05T11:00:00.000Z');

    const result = buildFollowUpCancelledActivityData({
      businessId: 'business-id',
      userId: 'user-id',
      followUpId: 'follow-up-id',
      cancelledAt,
    });

    expect(result).toEqual({
      businessId: 'business-id',
      userId: 'user-id',
      type: ActivityType.follow_up_cancelled,
      notes: 'Follow-up cancelled at 2026-07-05T11:00:00.000Z',
      metadata: {
        followUpId: 'follow-up-id',
        cancelledAt: '2026-07-05T11:00:00.000Z',
      },
    });
  });
});

describe('buildFollowUpUpdateData', () => {
  it('builds update data for dueDate', () => {
    const dueDate = new Date('2026-07-05T10:00:00.000Z');

    const result = buildFollowUpUpdateData({
      dueDate,
    });

    expect(result).toEqual({
      dueDate,
    });
  });

  it('builds update data for assignedToId', () => {
    const result = buildFollowUpUpdateData({
      assignedToId: '660e8400-e29b-41d4-a716-446655440000',
    });

    expect(result).toEqual({
      assignedTo: {
        connect: {
          id: '660e8400-e29b-41d4-a716-446655440000',
        },
      },
    });
  });

  it('builds update data for note', () => {
    const result = buildFollowUpUpdateData({
      note: 'Call the business next week.',
    });

    expect(result).toEqual({
      note: 'Call the business next week.',
    });
  });

  it('builds update data for several fields at once', () => {
    const dueDate = new Date('2026-07-05T10:00:00.000Z');

    const result = buildFollowUpUpdateData({
      assignedToId: '660e8400-e29b-41d4-a716-446655440000',
      dueDate,
      note: 'Visit the business in person.',
    });

    expect(result).toEqual({
      assignedTo: {
        connect: {
          id: '660e8400-e29b-41d4-a716-446655440000',
        },
      },
      dueDate,
      note: 'Visit the business in person.',
    });
  });

  it('does not include fields that were not provided', () => {
    const result = buildFollowUpUpdateData({
      note: 'Only update note.',
    });

    expect(result).not.toHaveProperty('dueDate');
    expect(result).not.toHaveProperty('assignedTo');
  });
});

describe('buildFollowUpUpdatedActivityData', () => {
  it('builds follow_up_updated activity data', () => {
    const previousDueDate = new Date('2026-07-05T10:00:00.000Z');
    const nextDueDate = new Date('2026-07-08T12:00:00.000Z');

    const result = buildFollowUpUpdatedActivityData({
      businessId: 'business-id',
      userId: 'user-id',
      followUpId: 'follow-up-id',
      previousDueDate,
      nextDueDate,
    });

    expect(result).toEqual({
      businessId: 'business-id',
      userId: 'user-id',
      type: ActivityType.follow_up_updated,
      notes:
        'Follow-up updated from 2026-07-05T10:00:00.000Z to 2026-07-08T12:00:00.000Z',
      metadata: {
        followUpId: 'follow-up-id',
        previousDueDate: '2026-07-05T10:00:00.000Z',
        nextDueDate: '2026-07-08T12:00:00.000Z',
      },
    });
  });
});
