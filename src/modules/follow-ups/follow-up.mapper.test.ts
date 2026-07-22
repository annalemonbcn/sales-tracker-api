import { describe, expect, it } from 'vitest';

import {
  ActivityType,
  BusinessStatus,
  Category,
  FollowUpStatus,
  FollowUpType,
  Priority,
  UserRole,
} from '../../generated/prisma/enums.js';
import { toFollowUpDto, toFollowUpTaskDto } from './follow-up.mapper.js';

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
      type: FollowUpType.call,
      title: 'Call the business',
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
      type: FollowUpType.call,
      title: 'Call the business',
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
      type: FollowUpType.email,
      title: 'Send email',
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
      type: FollowUpType.email,
      title: 'Send email',
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
      type: FollowUpType.call,
      title: 'Call completed',
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
      type: FollowUpType.call,
      title: 'Call completed',
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

describe('toFollowUpTaskDto', () => {
  it('maps a Prisma follow-up with assigned user and business to a public FollowUpTaskDto', () => {
    const dueDate = new Date('2026-07-05T10:00:00.000Z');
    const createdAt = new Date('2026-06-23T10:00:00.000Z');
    const updatedAt = new Date('2026-06-23T10:30:00.000Z');
    const activityCreatedAt = new Date('2026-06-23T10:05:00.000Z');

    const followUp: Parameters<typeof toFollowUpTaskDto>[0] = {
      id: 'follow-up-id',
      businessId: 'business-id',
      assignedToId: 'user-id',
      status: FollowUpStatus.pending,
      type: FollowUpType.call,
      title: 'Call the business',
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
      business: {
        id: 'business-id',
        name: 'Restaurante Pepito',
        category: Category.restaurant,
        status: BusinessStatus.waiting_response,
        priority: Priority.high,
      },
      activities: [
        {
          id: 'activity-id',
          businessId: 'business-id',
          followUpId: 'follow-up-id',
          userId: 'user-id',
          type: ActivityType.follow_up_created,
          notes: 'Follow-up created',
          metadata: { dueDate: dueDate.toISOString() },
          createdAt: activityCreatedAt,
          user: {
            id: 'user-id',
            name: 'Anna',
            email: 'anna@example.com',
            role: UserRole.admin,
          },
        },
      ],
    };

    expect(toFollowUpTaskDto(followUp)).toEqual({
      id: 'follow-up-id',
      status: FollowUpStatus.pending,
      type: FollowUpType.call,
      title: 'Call the business',
      dueDate,
      note: 'Call the business to check if they received the dossier.',
      completedAt: null,
      assignedTo: {
        id: 'user-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: UserRole.admin,
      },
      business: {
        id: 'business-id',
        name: 'Restaurante Pepito',
        category: Category.restaurant,
        status: BusinessStatus.waiting_response,
        priority: Priority.high,
      },
      activities: [
        {
          id: 'activity-id',
          type: ActivityType.follow_up_created,
          notes: 'Follow-up created',
          metadata: { dueDate: dueDate.toISOString() },
          user: {
            id: 'user-id',
            name: 'Anna',
            email: 'anna@example.com',
            role: UserRole.admin,
          },
          createdAt: activityCreatedAt,
        },
      ],
      createdAt,
      updatedAt,
    });
  });

  it('maps note as null when global follow-up has no note', () => {
    const dueDate = new Date('2026-07-05T10:00:00.000Z');
    const createdAt = new Date('2026-06-23T10:00:00.000Z');
    const updatedAt = new Date('2026-06-23T10:30:00.000Z');

    const followUp: Parameters<typeof toFollowUpTaskDto>[0] = {
      id: 'follow-up-id',
      businessId: 'business-id',
      assignedToId: 'user-id',
      status: FollowUpStatus.pending,
      type: FollowUpType.email,
      title: 'Send email',
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
      business: {
        id: 'business-id',
        name: 'Restaurante Pepito',
        category: Category.restaurant,
        status: BusinessStatus.waiting_response,
        priority: Priority.high,
      },
      activities: [],
    };

    expect(toFollowUpTaskDto(followUp)).toEqual({
      id: 'follow-up-id',
      status: FollowUpStatus.pending,
      type: FollowUpType.email,
      title: 'Send email',
      dueDate,
      note: null,
      completedAt: null,
      assignedTo: {
        id: 'user-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: UserRole.admin,
      },
      business: {
        id: 'business-id',
        name: 'Restaurante Pepito',
        category: Category.restaurant,
        status: BusinessStatus.waiting_response,
        priority: Priority.high,
      },
      activities: [],
      createdAt,
      updatedAt,
    });
  });

  it('maps completedAt when global follow-up is done', () => {
    const dueDate = new Date('2026-07-05T10:00:00.000Z');
    const completedAt = new Date('2026-07-05T11:00:00.000Z');
    const createdAt = new Date('2026-06-23T10:00:00.000Z');
    const updatedAt = new Date('2026-07-05T11:00:00.000Z');

    const followUp: Parameters<typeof toFollowUpTaskDto>[0] = {
      id: 'follow-up-id',
      businessId: 'business-id',
      assignedToId: 'user-id',
      status: FollowUpStatus.done,
      type: FollowUpType.call,
      title: 'Call completed',
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
      business: {
        id: 'business-id',
        name: 'Restaurante Pepito',
        category: Category.restaurant,
        status: BusinessStatus.interested,
        priority: Priority.high,
      },
      activities: [],
    };

    expect(toFollowUpTaskDto(followUp)).toEqual({
      id: 'follow-up-id',
      status: FollowUpStatus.done,
      type: FollowUpType.call,
      title: 'Call completed',
      dueDate,
      note: 'Call completed.',
      completedAt,
      assignedTo: {
        id: 'user-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: UserRole.admin,
      },
      business: {
        id: 'business-id',
        name: 'Restaurante Pepito',
        category: Category.restaurant,
        status: BusinessStatus.interested,
        priority: Priority.high,
      },
      activities: [],
      createdAt,
      updatedAt,
    });
  });
});
