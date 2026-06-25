import type {
  Business,
  FollowUp,
  Prisma,
  User,
} from '../../generated/prisma/client.js';

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

type FollowUpWithAssignedUserAndBusiness = Prisma.FollowUpGetPayload<{
  include: {
    assignedTo: {
      select: {
        id: true;
        name: true;
        email: true;
        role: true;
      };
    };
    business: {
      select: {
        id: true;
        name: true;
        category: true;
        status: true;
        priority: true;
      };
    };
  };
}>;

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

type FollowUpBusinessDto = Pick<
  Business,
  'id' | 'name' | 'category' | 'status' | 'priority'
>;

export type FollowUpTaskDto = Pick<
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
  business: FollowUpBusinessDto;
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

export const toFollowUpTaskDto = (
  followUp: FollowUpWithAssignedUserAndBusiness,
): FollowUpTaskDto => {
  return {
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

    business: {
      id: followUp.business.id,
      name: followUp.business.name,
      category: followUp.business.category,
      status: followUp.business.status,
      priority: followUp.business.priority,
    },

    createdAt: followUp.createdAt,
    updatedAt: followUp.updatedAt,
  };
};
