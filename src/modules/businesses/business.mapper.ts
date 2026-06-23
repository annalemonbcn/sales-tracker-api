import type { Business, Prisma, User } from '../../generated/prisma/client.js';

type BusinessWithUsers = Prisma.BusinessGetPayload<{
  include: {
    createdBy: {
      select: {
        id: true;
        name: true;
        email: true;
        role: true;
      };
    };
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

type BusinessUserDto = Pick<User, 'id' | 'name' | 'email' | 'role'>;

type BusinessDetailsDto = Pick<
  Business,
  'instagram' | 'email' | 'phone' | 'website' | 'address'
>;

export type BusinessDto = Pick<
  Business,
  | 'id'
  | 'name'
  | 'category'
  | 'status'
  | 'priority'
  | 'source'
  | 'notes'
  | 'lastContactedAt'
  | 'nextFollowUpAt'
  | 'createdAt'
  | 'updatedAt'
> & {
  details: BusinessDetailsDto;
  createdBy: BusinessUserDto;
  assignedTo: BusinessUserDto | null;
};

export const toBusinessDto = (business: BusinessWithUsers): BusinessDto => ({
  id: business.id,
  name: business.name,
  category: business.category,
  status: business.status,
  priority: business.priority,
  source: business.source,

  details: {
    instagram: business.instagram,
    email: business.email,
    phone: business.phone,
    website: business.website,
    address: business.address,
  },

  notes: business.notes,
  lastContactedAt: business.lastContactedAt,
  nextFollowUpAt: business.nextFollowUpAt,

  createdBy: {
    id: business.createdBy.id,
    name: business.createdBy.name,
    email: business.createdBy.email,
    role: business.createdBy.role,
  },

  assignedTo: business.assignedTo
    ? {
        id: business.assignedTo.id,
        name: business.assignedTo.name,
        email: business.assignedTo.email,
        role: business.assignedTo.role,
      }
    : null,

  createdAt: business.createdAt,
  updatedAt: business.updatedAt,
});
