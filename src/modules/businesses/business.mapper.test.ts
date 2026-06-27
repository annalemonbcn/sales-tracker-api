import { describe, expect, it } from 'vitest';

import { toBusinessDetailDto, toBusinessDto } from './business.mapper.js';
import {
  ActivityType,
  BusinessStatus,
  Category,
  LeadSource,
  Priority,
  UserRole,
} from '../../generated/prisma/enums.js';

describe('toBusinessDto', () => {
  it('maps a Prisma business with users to a public BusinessDto', () => {
    const createdAt = new Date('2026-06-22T10:00:00.000Z');
    const updatedAt = new Date('2026-06-22T11:00:00.000Z');

    const business = {
      id: 'business-id',
      name: 'Maison Lumière',
      category: 'beauty_center',
      status: 'assigned',
      priority: 'high',
      source: 'google_maps',

      instagram: 'maisonlumiere_bcn',
      email: 'hello@maisonlumiere.com',
      phone: '934567890',
      website: 'https://maisonlumiere.com',
      address: 'Carrer de València 245, Barcelona',

      notes: 'Centro de estética premium.',
      lastContactedAt: null,
      nextFollowUpAt: null,

      createdById: 'created-by-id',
      assignedToId: 'assigned-to-id',

      createdAt,
      updatedAt,

      createdBy: {
        id: 'created-by-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: 'admin',
      },

      assignedTo: {
        id: 'assigned-to-id',
        name: 'Marta',
        email: 'marta@example.com',
        role: 'commercial',
      },
    } as const;

    expect(toBusinessDto(business)).toEqual({
      id: 'business-id',
      name: 'Maison Lumière',
      category: 'beauty_center',
      status: 'assigned',
      priority: 'high',
      source: 'google_maps',

      details: {
        instagram: 'maisonlumiere_bcn',
        email: 'hello@maisonlumiere.com',
        phone: '934567890',
        website: 'https://maisonlumiere.com',
        address: 'Carrer de València 245, Barcelona',
      },

      notes: 'Centro de estética premium.',
      lastContactedAt: null,
      nextFollowUpAt: null,

      createdBy: {
        id: 'created-by-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: 'admin',
      },

      assignedTo: {
        id: 'assigned-to-id',
        name: 'Marta',
        email: 'marta@example.com',
        role: 'commercial',
      },

      createdAt,
      updatedAt,
    });
  });

  it('maps assignedTo as null when the business is unassigned', () => {
    const createdAt = new Date('2026-06-22T10:00:00.000Z');
    const updatedAt = new Date('2026-06-22T11:00:00.000Z');

    const business = {
      id: 'business-id',
      name: 'Casa Bruna',
      category: 'restaurant',
      status: 'new_lead',
      priority: 'medium',
      source: 'instagram',

      instagram: null,
      email: null,
      phone: null,
      website: null,
      address: null,

      notes: null,
      lastContactedAt: null,
      nextFollowUpAt: null,

      createdById: 'created-by-id',
      assignedToId: null,

      createdAt,
      updatedAt,

      createdBy: {
        id: 'created-by-id',
        name: 'Anna',
        email: 'anna@example.com',
        role: 'admin',
      },

      assignedTo: null,
    } as const;

    expect(toBusinessDto(business).assignedTo).toBeNull();
    expect(toBusinessDto(business).details).toEqual({
      instagram: null,
      email: null,
      phone: null,
      website: null,
      address: null,
    });
  });
});

describe('toBusinessDetailDto', () => {
  it('maps business details with activities to BusinessDetailDto', () => {
    const business = {
      id: 'business-id',
      name: 'Federal Café',
      category: Category.restaurant,
      status: BusinessStatus.waiting_response,
      priority: Priority.high,
      source: LeadSource.instagram,
      instagram: '@federalcafe',
      email: 'hello@federalcafe.dev',
      phone: '+34 600 100 001',
      website: 'https://federalcafe.dev',
      address: 'Barcelona',
      notes: 'Some notes',
      lastContactedAt: null,
      nextFollowUpAt: null,
      createdAt: new Date('2026-06-01T09:00:00.000Z'),
      updatedAt: new Date('2026-06-01T09:00:00.000Z'),
      createdById: 'admin-id',
      assignedToId: 'user-id',
      createdBy: {
        id: 'admin-id',
        name: 'Anna Admin',
        email: 'anna@sales-tracker.dev',
        role: UserRole.admin,
      },
      assignedTo: {
        id: 'user-id',
        name: 'Marc Sales',
        email: 'marc@sales-tracker.dev',
        role: UserRole.commercial,
      },
      activities: [
        {
          id: 'activity-id',
          businessId: 'business-id',
          userId: 'user-id',
          type: ActivityType.instagram_message_sent,
          notes: 'Initial Instagram message sent.',
          metadata: {
            channel: 'instagram',
          },
          createdAt: new Date('2026-06-05T10:00:00.000Z'),
          user: {
            id: 'user-id',
            name: 'Marc Sales',
            email: 'marc@sales-tracker.dev',
            role: UserRole.commercial,
          },
        },
      ],
    };

    expect(toBusinessDetailDto(business)).toEqual({
      id: 'business-id',
      name: 'Federal Café',
      category: Category.restaurant,
      status: BusinessStatus.waiting_response,
      priority: Priority.high,
      source: LeadSource.instagram,
      details: {
        instagram: '@federalcafe',
        email: 'hello@federalcafe.dev',
        phone: '+34 600 100 001',
        website: 'https://federalcafe.dev',
        address: 'Barcelona',
      },
      notes: 'Some notes',
      lastContactedAt: null,
      nextFollowUpAt: null,
      createdBy: {
        id: 'admin-id',
        name: 'Anna Admin',
        email: 'anna@sales-tracker.dev',
        role: UserRole.admin,
      },
      assignedTo: {
        id: 'user-id',
        name: 'Marc Sales',
        email: 'marc@sales-tracker.dev',
        role: UserRole.commercial,
      },
      createdAt: new Date('2026-06-01T09:00:00.000Z'),
      updatedAt: new Date('2026-06-01T09:00:00.000Z'),
      activities: [
        {
          id: 'activity-id',
          type: ActivityType.instagram_message_sent,
          notes: 'Initial Instagram message sent.',
          metadata: {
            channel: 'instagram',
          },
          user: {
            id: 'user-id',
            name: 'Marc Sales',
            email: 'marc@sales-tracker.dev',
            role: UserRole.commercial,
          },
          createdAt: new Date('2026-06-05T10:00:00.000Z'),
        },
      ],
    });
  });
});
