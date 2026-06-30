import { describe, expect, it } from 'vitest';

import {
  buildBusinessAssignedActivityData,
  buildBusinessCreateData,
  buildBusinessCreatedActivityData,
  buildBusinessUpdateData,
  buildBusinessWhere,
  buildPriorityChangedActivityData,
  buildStatusChangedActivityData,
} from './business.prisma-mapper.js';

import type { CreateBusinessInput } from './business.schemas.js';

// TODO: add tests for buildBusinessWhere
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

  it('builds an empty Prisma where object when no filters are provided', () => {
    const result = buildBusinessWhere({});

    expect(result).toEqual({});
  });

  it('builds Prisma where object with direct filters', () => {
    const result = buildBusinessWhere({
      status: 'assigned',
      category: 'beauty_center',
      priority: 'high',
      source: 'google_maps',
      assignedToId: '550e8400-e29b-41d4-a716-446655440000',
    });

    expect(result).toEqual({
      status: 'assigned',
      category: 'beauty_center',
      priority: 'high',
      source: 'google_maps',
      assignedToId: '550e8400-e29b-41d4-a716-446655440000',
    });
  });

  it('builds Prisma where object with search filter', () => {
    const result = buildBusinessWhere({
      search: 'maison',
    });

    expect(result).toEqual({
      OR: [
        {
          name: {
            contains: 'maison',
            mode: 'insensitive',
          },
        },
        {
          instagram: {
            contains: 'maison',
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: 'maison',
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: 'maison',
            mode: 'insensitive',
          },
        },
        {
          address: {
            contains: 'maison',
            mode: 'insensitive',
          },
        },
      ],
    });
  });

  it('builds Prisma where object combining direct filters and search', () => {
    const result = buildBusinessWhere({
      status: 'assigned',
      priority: 'high',
      search: 'maison',
    });

    expect(result).toEqual({
      status: 'assigned',
      priority: 'high',
      OR: [
        {
          name: {
            contains: 'maison',
            mode: 'insensitive',
          },
        },
        {
          instagram: {
            contains: 'maison',
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: 'maison',
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: 'maison',
            mode: 'insensitive',
          },
        },
        {
          address: {
            contains: 'maison',
            mode: 'insensitive',
          },
        },
      ],
    });
  });

  it('builds Prisma update data with only provided scalar fields', () => {
    const result = buildBusinessUpdateData({
      name: 'Updated Business',
      priority: 'high',
      notes: 'Updated notes',
    });

    expect(result).toEqual({
      name: 'Updated Business',
      priority: 'high',
      notes: 'Updated notes',
    });
  });

  it('builds Prisma update data to assign a business', () => {
    const result = buildBusinessUpdateData({
      assignedToId: '550e8400-e29b-41d4-a716-446655440000',
    });

    expect(result).toEqual({
      assignedTo: {
        connect: {
          id: '550e8400-e29b-41d4-a716-446655440000',
        },
      },
    });
  });

  it('builds Prisma update data to unassign a business', () => {
    const result = buildBusinessUpdateData({
      assignedToId: null,
    });

    expect(result).toEqual({
      assignedTo: {
        disconnect: true,
      },
    });
  });

  it('builds status_changed activity data', () => {
    const result = buildStatusChangedActivityData({
      businessId: 'business-id',
      userId: 'user-id',
      previousStatus: 'assigned',
      nextStatus: 'interested',
    });

    expect(result).toEqual({
      businessId: 'business-id',
      userId: 'user-id',
      type: 'status_changed',
      notes: 'Status changed from assigned to interested',
      metadata: {
        previousStatus: 'assigned',
        nextStatus: 'interested',
      },
    });
  });

  it('builds priority_changed activity data', () => {
    const result = buildPriorityChangedActivityData({
      businessId: 'business-id',
      userId: 'user-id',
      previousPriority: 'medium',
      nextPriority: 'high',
    });

    expect(result).toEqual({
      businessId: 'business-id',
      userId: 'user-id',
      type: 'priority_changed',
      notes: 'Priority changed from medium to high',
      metadata: {
        previousPriority: 'medium',
        nextPriority: 'high',
      },
    });
  });

  it('builds where filter by assigned user id', () => {
    const result = buildBusinessWhere({
      assignedToId: '550e8400-e29b-41d4-a716-446655440000',
    });

    expect(result).toEqual({
      assignedToId: '550e8400-e29b-41d4-a716-446655440000',
    });
  });

  it('builds where filter for unassigned businesses', () => {
    const result = buildBusinessWhere({
      assignedToId: 'unassigned',
    });

    expect(result).toEqual({
      assignedToId: null,
    });
  });

  it('does not build assignedToId filter when assignedToId is null', () => {
    const result = buildBusinessWhere({
      assignedToId: null,
    });

    expect(result).toEqual({});
  });
});
