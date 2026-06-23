import type {
  ActivityType,
  Prisma,
  UserRole,
} from '../../generated/prisma/client.js';

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

type ActivityUserDto = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type ActivityDto = {
  id: string;
  type: ActivityType;
  notes: string | null;
  metadata: Prisma.JsonValue;
  user: ActivityUserDto;
  createdAt: Date;
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
