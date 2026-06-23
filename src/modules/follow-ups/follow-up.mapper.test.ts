import { describe, expect, it } from 'vitest';

import { FollowUpStatus, UserRole } from '../../generated/prisma/enums.js';
import { toFollowUpDto } from './follow-up.mapper.js';

describe('toFollowUpDto', () => {
  it('maps a Prisma follow-up with assigned user to a public FollowUpDto', () => {
    const dueDate = new Date('2026-07-05T10:00:00.000Z');
    const createdAt = new Date('2026-06-23T10:00:00.000Z');
    const updatedAt = new Date('2026-06-23T10:30:00.000Z');

    const followUp = {
      id: 'follow-up-id',
      businessId: 'business-id',
      assignedToId: 'user-id',
      status: FollowUpStatus.pending,
      dueDate,
      note: 'Call the business to check if they received the dossier.',
      completedAt: null,
      createdAt,
      updatedAt,
      assignedTo: {
        id: 'user-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: UserRole.admin,
      },
    };

    expect(toFollowUpDto(followUp)).toEqual({
      id: 'follow-up-id',
      status: FollowUpStatus.pending,
      dueDate,
      note: 'Call the business to check if they received the dossier.',
      completedAt: null,
      assignedTo: {
        id: 'user-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: UserRole.admin,
      },
      createdAt,
      updatedAt,
    });
  });

  it('maps note as null when follow-up has no note', () => {
    const dueDate = new Date('2026-07-05T10:00:00.000Z');
    const createdAt = new Date('2026-06-23T10:00:00.000Z');
    const updatedAt = new Date('2026-06-23T10:30:00.000Z');

    const followUp = {
      id: 'follow-up-id',
      businessId: 'business-id',
      assignedToId: 'user-id',
      status: FollowUpStatus.pending,
      dueDate,
      note: null,
      completedAt: null,
      createdAt,
      updatedAt,
      assignedTo: {
        id: 'user-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: UserRole.admin,
      },
    };

    expect(toFollowUpDto(followUp)).toEqual({
      id: 'follow-up-id',
      status: FollowUpStatus.pending,
      dueDate,
      note: null,
      completedAt: null,
      assignedTo: {
        id: 'user-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: UserRole.admin,
      },
      createdAt,
      updatedAt,
    });
  });

  it('maps completedAt when follow-up is done', () => {
    const dueDate = new Date('2026-07-05T10:00:00.000Z');
    const completedAt = new Date('2026-07-05T11:00:00.000Z');
    const createdAt = new Date('2026-06-23T10:00:00.000Z');
    const updatedAt = new Date('2026-07-05T11:00:00.000Z');

    const followUp = {
      id: 'follow-up-id',
      businessId: 'business-id',
      assignedToId: 'user-id',
      status: FollowUpStatus.done,
      dueDate,
      note: 'Call completed.',
      completedAt,
      createdAt,
      updatedAt,
      assignedTo: {
        id: 'user-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: UserRole.admin,
      },
    };

    expect(toFollowUpDto(followUp)).toEqual({
      id: 'follow-up-id',
      status: FollowUpStatus.done,
      dueDate,
      note: 'Call completed.',
      completedAt,
      assignedTo: {
        id: 'user-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: UserRole.admin,
      },
      createdAt,
      updatedAt,
    });
  });
});
