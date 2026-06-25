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
