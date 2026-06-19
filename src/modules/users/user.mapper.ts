import type { User } from '../../generated/prisma/client.js';

export const toUserDto = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  active: user.active,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
