import type {
  Activity,
  Business,
  Prisma,
  User,
} from '../../generated/prisma/client.js';

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

type BusinessWithActivities = Prisma.BusinessGetPayload<{
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
    activities: {
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
    };
  };
}>;

type BusinessUserDto = Pick<User, 'id' | 'name' | 'email' | 'role'>;

type BusinessContactDetailsDto = Pick<
  Business,
  'instagram' | 'email' | 'phone' | 'website' | 'address'
>;

type BusinessActivityDto = Pick<
  Activity,
  'id' | 'type' | 'notes' | 'metadata' | 'createdAt'
> & {
  user: BusinessUserDto;
};

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
  details: BusinessContactDetailsDto;
  createdBy: BusinessUserDto;
  assignedTo: BusinessUserDto | null;
};

export type BusinessDetailDto = BusinessDto & {
  activities: BusinessActivityDto[];
};

const toBusinessUserDto = (user: BusinessUserDto): BusinessUserDto => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const toBusinessActivityDto = (
  activity: BusinessWithActivities['activities'][number],
): BusinessActivityDto => ({
  id: activity.id,
  type: activity.type,
  notes: activity.notes,
  metadata: activity.metadata,
  createdAt: activity.createdAt,
  user: toBusinessUserDto(activity.user),
});

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

  createdBy: toBusinessUserDto(business.createdBy),

  assignedTo: business.assignedTo
    ? toBusinessUserDto(business.assignedTo)
    : null,

  createdAt: business.createdAt,
  updatedAt: business.updatedAt,
});

export const toBusinessDetailDto = (
  business: BusinessWithActivities,
): BusinessDetailDto => ({
  ...toBusinessDto(business),
  activities: business.activities.map(toBusinessActivityDto),
});
