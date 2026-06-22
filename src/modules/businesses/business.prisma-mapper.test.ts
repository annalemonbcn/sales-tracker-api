import { describe, expect, it } from 'vitest';

import {
  buildBusinessAssignedActivityData,
  buildBusinessCreateData,
  buildBusinessCreatedActivityData,
} from './business.prisma-mapper.js';

import type { CreateBusinessInput } from './business.schemas.js';

describe('business prisma mapper', () => {
  it('builds Prisma create data for an unassigned business', () => {
    const input: CreateBusinessInput = {
      name: 'Maison Lumière',
      category: 'beauty_center',
      source: 'google_maps',
      priority: 'high',
      instagram: 'maisonlumiere_bcn',
      email: 'hello@maisonlumiere.com',
      phone: '934567890',
      website: 'https://maisonlumiere.com',
      address: 'Carrer de València 245, Barcelona',
      notes: 'Centro de estética premium.',
      createdById: '550e8400-e29b-41d4-a716-446655440000',
    };

    const result = buildBusinessCreateData(input, 'new_lead');

    expect(result).toEqual({
      name: 'Maison Lumière',
      category: 'beauty_center',
      status: 'new_lead',
      source: 'google_maps',
      priority: 'high',
      instagram: 'maisonlumiere_bcn',
      email: 'hello@maisonlumiere.com',
      phone: '934567890',
      website: 'https://maisonlumiere.com',
      address: 'Carrer de València 245, Barcelona',
      notes: 'Centro de estética premium.',
      createdBy: {
        connect: {
          id: '550e8400-e29b-41d4-a716-446655440000',
        },
      },
    });
  });

  it('builds Prisma create data for an assigned business', () => {
    const input: CreateBusinessInput = {
      name: 'Casa Bruna',
      category: 'restaurant',
      source: 'instagram',
      priority: 'medium',
      createdById: '550e8400-e29b-41d4-a716-446655440000',
      assignedToId: '660e8400-e29b-41d4-a716-446655440000',
    };

    const result = buildBusinessCreateData(input, 'assigned');

    expect(result).toEqual({
      name: 'Casa Bruna',
      category: 'restaurant',
      status: 'assigned',
      source: 'instagram',
      priority: 'medium',
      instagram: null,
      email: null,
      phone: null,
      website: null,
      address: null,
      notes: null,
      createdBy: {
        connect: {
          id: '550e8400-e29b-41d4-a716-446655440000',
        },
      },
      assignedTo: {
        connect: {
          id: '660e8400-e29b-41d4-a716-446655440000',
        },
      },
    });
  });

  it('builds business_created activity data', () => {
    const result = buildBusinessCreatedActivityData({
      businessId: 'business-id',
      userId: 'user-id',
    });

    expect(result).toEqual({
      businessId: 'business-id',
      userId: 'user-id',
      type: 'business_created',
      notes: 'Business created',
    });
  });

  it('builds business_assigned activity data', () => {
    const result = buildBusinessAssignedActivityData({
      businessId: 'business-id',
      userId: 'user-id',
      assignedToId: 'assigned-user-id',
    });

    expect(result).toEqual({
      businessId: 'business-id',
      userId: 'user-id',
      type: 'business_assigned',
      notes: 'Business assigned to user assigned-user-id',
      metadata: {
        assignedToId: 'assigned-user-id',
      },
    });
  });
});