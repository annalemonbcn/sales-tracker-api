import { describe, expect, it } from 'vitest';

import {
  buildBusinessUpdateDataFromActivity,
  buildManualActivityCreateData,
  getNextStatusFromActivityType,
  shouldUpdateLastContactedAt,
} from './activity.prisma-mapper.js';
import { ActivityType, BusinessStatus } from '../../generated/prisma/enums.js';

describe('buildManualActivityCreateData', () => {
  it('builds Prisma create data for a manual activity with notes and metadata', () => {
    const result = buildManualActivityCreateData(
      {
        businessId: 'business-id',
      },
      {
        type: 'instagram_message_sent',
        userId: 'user-id',
        notes: 'Le he escrito por Instagram.',
        metadata: {
          channel: 'instagram',
          attempts: 1,
        },
      },
    );

    expect(result).toEqual({
      businessId: 'business-id',
      userId: 'user-id',
      type: 'instagram_message_sent',
      notes: 'Le he escrito por Instagram.',
      metadata: {
        channel: 'instagram',
        attempts: 1,
      },
    });
  });

  it('builds Prisma create data with notes as null when notes are not provided', () => {
    const result = buildManualActivityCreateData(
      {
        businessId: 'business-id',
      },
      {
        type: 'phone_call_done',
        userId: 'user-id',
      },
    );

    expect(result).toEqual({
      businessId: 'business-id',
      userId: 'user-id',
      type: 'phone_call_done',
      notes: null,
    });
  });

  it('does not include metadata when metadata is not provided', () => {
    const result = buildManualActivityCreateData(
      {
        businessId: 'business-id',
      },
      {
        type: 'email_sent',
        userId: 'user-id',
      },
    );

    expect(result).not.toHaveProperty('metadata');
  });
});

describe('shouldUpdateLastContactedAt', () => {
  it('returns true for contact activity types', () => {
    expect(
      shouldUpdateLastContactedAt(ActivityType.instagram_message_sent),
    ).toBe(true);

    expect(shouldUpdateLastContactedAt(ActivityType.email_sent)).toBe(true);

    expect(shouldUpdateLastContactedAt(ActivityType.phone_call_done)).toBe(
      true,
    );

    expect(shouldUpdateLastContactedAt(ActivityType.visit_done)).toBe(true);
  });

  it('returns false for non-contact activity types', () => {
    expect(shouldUpdateLastContactedAt(ActivityType.note_added)).toBe(false);

    expect(shouldUpdateLastContactedAt(ActivityType.dossier_sent)).toBe(false);

    expect(shouldUpdateLastContactedAt(ActivityType.response_received)).toBe(
      false,
    );
  });
});

describe('getNextStatusFromActivityType', () => {
  it('returns waiting_response for instagram_message_sent', () => {
    expect(
      getNextStatusFromActivityType(ActivityType.instagram_message_sent),
    ).toBe(BusinessStatus.waiting_response);
  });

  it('returns waiting_response for email_sent', () => {
    expect(getNextStatusFromActivityType(ActivityType.email_sent)).toBe(
      BusinessStatus.waiting_response,
    );
  });

  it('returns dossier_sent for dossier_sent activity', () => {
    expect(getNextStatusFromActivityType(ActivityType.dossier_sent)).toBe(
      BusinessStatus.dossier_sent,
    );
  });

  it('returns meeting_scheduled for meeting_scheduled activity', () => {
    expect(getNextStatusFromActivityType(ActivityType.meeting_scheduled)).toBe(
      BusinessStatus.meeting_scheduled,
    );
  });

  it('returns meeting_done for meeting_done activity', () => {
    expect(getNextStatusFromActivityType(ActivityType.meeting_done)).toBe(
      BusinessStatus.meeting_done,
    );
  });

  it('returns proposal_sent for proposal_sent activity', () => {
    expect(getNextStatusFromActivityType(ActivityType.proposal_sent)).toBe(
      BusinessStatus.proposal_sent,
    );
  });

  it('returns interested for response_received activity', () => {
    expect(getNextStatusFromActivityType(ActivityType.response_received)).toBe(
      BusinessStatus.interested,
    );
  });

  it('returns undefined for activity types that do not imply a status change', () => {
    expect(getNextStatusFromActivityType(ActivityType.note_added)).toBe(
      undefined,
    );

    expect(getNextStatusFromActivityType(ActivityType.phone_call_done)).toBe(
      undefined,
    );

    expect(getNextStatusFromActivityType(ActivityType.visit_done)).toBe(
      undefined,
    );
  });
});

describe('buildBusinessUpdateDataFromActivity', () => {
  it('builds update data with lastContactedAt and status for instagram_message_sent', () => {
    const contactedAt = new Date('2026-06-23T10:00:00.000Z');

    const result = buildBusinessUpdateDataFromActivity({
      type: ActivityType.instagram_message_sent,
      contactedAt,
    });

    expect(result).toEqual({
      lastContactedAt: contactedAt,
      status: BusinessStatus.waiting_response,
    });
  });

  it('builds update data with lastContactedAt and status for email_sent', () => {
    const contactedAt = new Date('2026-06-23T10:00:00.000Z');

    const result = buildBusinessUpdateDataFromActivity({
      type: ActivityType.email_sent,
      contactedAt,
    });

    expect(result).toEqual({
      lastContactedAt: contactedAt,
      status: BusinessStatus.waiting_response,
    });
  });

  it('builds update data with only lastContactedAt for phone_call_done', () => {
    const contactedAt = new Date('2026-06-23T10:00:00.000Z');

    const result = buildBusinessUpdateDataFromActivity({
      type: ActivityType.phone_call_done,
      contactedAt,
    });

    expect(result).toEqual({
      lastContactedAt: contactedAt,
    });
  });

  it('builds update data with only status for dossier_sent', () => {
    const contactedAt = new Date('2026-06-23T10:00:00.000Z');

    const result = buildBusinessUpdateDataFromActivity({
      type: ActivityType.dossier_sent,
      contactedAt,
    });

    expect(result).toEqual({
      status: BusinessStatus.dossier_sent,
    });
  });

  it('builds empty update data for note_added', () => {
    const contactedAt = new Date('2026-06-23T10:00:00.000Z');

    const result = buildBusinessUpdateDataFromActivity({
      type: ActivityType.note_added,
      contactedAt,
    });

    expect(result).toEqual({});
  });
});
