import { describe, expect, it } from 'vitest';

import { toUserDto } from './user.mapper.js';

describe('toUserDto', () => {
  it('maps a Prisma user to a public UserDto', () => {
    const user = {
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'commercial',
      active: true,
      createdAt: new Date('2026-06-22T10:00:00.000Z'),
      updatedAt: new Date('2026-06-22T11:00:00.000Z'),
    } as const;

    expect(toUserDto(user)).toEqual({
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'commercial',
      active: true,
      createdAt: new Date('2026-06-22T10:00:00.000Z'),
      updatedAt: new Date('2026-06-22T11:00:00.000Z'),
    });
  });
})