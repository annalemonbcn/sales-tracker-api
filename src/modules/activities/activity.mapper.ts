import type { Activity, Prisma, User } from '../../generated/prisma/client.js';

type ActivityWithUser = Prisma.ActivityGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        email: true;
        role: true;
      };
    };
  };
}>;

type ActivityUserDto = Pick<User, 'id' | 'name' | 'email' | 'role'>;

export type ActivityDto = Pick<
  Activity,
  'id' | 'type' | 'notes' | 'metadata' | 'createdAt'
> & {
  user: ActivityUserDto;
};

export const toActivityDto = (activity: ActivityWithUser): ActivityDto => ({
  id: activity.id,
  type: activity.type,
  notes: activity.notes,
  metadata: activity.metadata,
  user: {
    id: activity.user.id,
    name: activity.user.name,
    email: activity.user.email,
    role: activity.user.role,
  },
  createdAt: activity.createdAt,
});
