import type { User } from '../../generated/prisma/client.js';

export type UserDto = Pick<
  User,
  'id' | 'name' | 'email' | 'role' | 'active' | 'createdAt' | 'updatedAt'
>;

export const toUserDto = (user: User): UserDto => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  active: user.active,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
