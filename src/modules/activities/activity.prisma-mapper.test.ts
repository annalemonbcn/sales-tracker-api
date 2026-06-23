import { describe, expect, it } from 'vitest';

import { buildManualActivityCreateData } from './activity.prisma-mapper.js';

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
