import type {
  BusinessStatus,
  Category,
  LeadSource,
  Priority,
  Prisma,
  UserRole,
} from '../../generated/prisma/client.js';

type BusinessUserDto = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type BusinessDto = {
  id: string;
  name: string;
  category: Category;
  status: BusinessStatus;
  priority: Priority;
  source: LeadSource;

  details: {
    instagram: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    address: string | null;
  };

  notes: string | null;
  lastContactedAt: Date | null;
  nextFollowUpAt: Date | null;

  createdBy: BusinessUserDto;
  assignedTo: BusinessUserDto | null;

  createdAt: Date;
  updatedAt: Date;
};

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
