import type { FollowUp, Prisma, User } from '../../generated/prisma/client.js';

type FollowUpWithAssignedUser = Prisma.FollowUpGetPayload<{
  include: {
    assignedTo: {
      select: {
        id: true;
        name: true;
        email: true;
        role: true;
      };
    };
  };
}>;

type FollowUpAssignedUserDto = Pick<User, 'id' | 'name' | 'email' | 'role'>;

export type FollowUpDto = Pick<
  FollowUp,
  | 'id'
  | 'status'
  | 'dueDate'
  | 'note'
  | 'completedAt'
  | 'createdAt'
  | 'updatedAt'
> & {
  assignedTo: FollowUpAssignedUserDto;
};

export const toFollowUpDto = (
  followUp: FollowUpWithAssignedUser,
): FollowUpDto => ({
  id: followUp.id,
  status: followUp.status,
  dueDate: followUp.dueDate,
  note: followUp.note,
  completedAt: followUp.completedAt,
  assignedTo: {
    id: followUp.assignedTo.id,
    name: followUp.assignedTo.name,
    email: followUp.assignedTo.email,
    role: followUp.assignedTo.role,
  },
  createdAt: followUp.createdAt,
  updatedAt: followUp.updatedAt,
});
