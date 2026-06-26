import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { env } from '../src/config/env.js';
import {
  ActivityType,
  BusinessStatus,
  Category,
  FollowUpStatus,
  LeadSource,
  Priority,
  UserRole,
} from '../src/generated/prisma/enums.js';

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const userIds = {
  anna: '11111111-1111-4111-8111-111111111111',
  marc: '22222222-2222-4222-8222-222222222222',
  laura: '33333333-3333-4333-8333-333333333333',
  nil: '44444444-4444-4444-8444-444444444444',
  julia: '55555555-5555-4555-8555-555555555555',
  pau: '66666666-6666-4666-8666-666666666666',
};

const businessIds = {
  federalCafe: '10000000-0000-4000-8000-000000000001',
  parkingPizza: '10000000-0000-4000-8000-000000000002',
  satansCoffee: '10000000-0000-4000-8000-000000000003',
  casaBonay: '10000000-0000-4000-8000-000000000004',
  holmesPlace: '10000000-0000-4000-8000-000000000005',
  blowHairSalon: '10000000-0000-4000-8000-000000000006',
  greenVita: '10000000-0000-4000-8000-000000000007',
  bravissimo: '10000000-0000-4000-8000-000000000008',
  cooltra: '10000000-0000-4000-8000-000000000009',
  drBloomClinic: '10000000-0000-4000-8000-000000000010',
  veritas: '10000000-0000-4000-8000-000000000011',
  ritualGym: '10000000-0000-4000-8000-000000000012',
};

const main = async () => {
  await cleanDatabase();

  const users = await seedUsers();
  const businesses = await seedBusinesses(users);

  await seedActivities(users, businesses);
  await seedFollowUps(users, businesses);

  console.log('Database seeded successfully');
};

const cleanDatabase = async () => {
  await prisma.activity.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();
};

const seedUsers = async () => {
  const anna = await prisma.user.create({
    data: {
      id: userIds.anna,
      name: 'Anna Admin',
      email: 'anna@sales-tracker.dev',
      role: UserRole.admin,
      active: true,
    },
  });

  const marc = await prisma.user.create({
    data: {
      id: userIds.marc,
      name: 'Marc Sales',
      email: 'marc@sales-tracker.dev',
      role: UserRole.commercial,
      active: true,
    },
  });

  const laura = await prisma.user.create({
    data: {
      id: userIds.laura,
      name: 'Laura Sales',
      email: 'laura@sales-tracker.dev',
      role: UserRole.commercial,
      active: true,
    },
  });

  const nil = await prisma.user.create({
    data: {
      id: userIds.nil,
      name: 'Nil Sales',
      email: 'nil@sales-tracker.dev',
      role: UserRole.commercial,
      active: true,
    },
  });

  const julia = await prisma.user.create({
    data: {
      id: userIds.julia,
      name: 'Júlia Sales',
      email: 'julia@sales-tracker.dev',
      role: UserRole.commercial,
      active: true,
    },
  });

  const pau = await prisma.user.create({
    data: {
      id: userIds.pau,
      name: 'Pau Sales',
      email: 'pau@sales-tracker.dev',
      role: UserRole.commercial,
      active: false,
    },
  });

  return {
    anna,
    marc,
    laura,
    nil,
    julia,
    pau,
  };
};

const seedBusinesses = async (users: Awaited<ReturnType<typeof seedUsers>>) => {
  const federalCafe = await prisma.business.create({
    data: {
      id: businessIds.federalCafe,
      name: 'Federal Café',
      category: Category.restaurant,
      status: BusinessStatus.waiting_response,
      priority: Priority.high,
      source: LeadSource.instagram,
      instagram: '@federalcafe',
      email: 'hello@federalcafe.dev',
      phone: '+34 600 100 001',
      website: 'https://federalcafe.dev',
      address: 'Carrer del Parlament, Barcelona',
      notes:
        'Potential fit for a lunch traffic campaign. First contact made through Instagram.',
      createdById: users.anna.id,
      assignedToId: users.marc.id,
      lastContactedAt: new Date('2026-06-05T10:00:00.000Z'),
      nextFollowUpAt: new Date('2026-07-04T09:30:00.000Z'),
    },
  });

  const parkingPizza = await prisma.business.create({
    data: {
      id: businessIds.parkingPizza,
      name: 'Parking Pizza',
      category: Category.restaurant,
      status: BusinessStatus.dossier_sent,
      priority: Priority.medium,
      source: LeadSource.google_maps,
      instagram: '@parkingpizza',
      email: 'contact@parkingpizza.dev',
      phone: '+34 600 100 002',
      website: 'https://parkingpizza.dev',
      address: 'Carrer de Londres, Barcelona',
      notes: 'Asked for a commercial dossier after the first email.',
      createdById: users.anna.id,
      assignedToId: users.laura.id,
      lastContactedAt: new Date('2026-06-07T11:00:00.000Z'),
      nextFollowUpAt: new Date('2026-07-08T12:00:00.000Z'),
    },
  });

  const satansCoffee = await prisma.business.create({
    data: {
      id: businessIds.satansCoffee,
      name: "Satan's Coffee Corner",
      category: Category.restaurant,
      status: BusinessStatus.interested,
      priority: Priority.high,
      source: LeadSource.instagram,
      instagram: '@satanscoffee',
      email: 'hello@satanscoffee.dev',
      phone: '+34 600 100 003',
      website: 'https://satanscoffee.dev',
      address: 'El Born, Barcelona',
      notes:
        'Very active on Instagram. They replied positively and asked for more details.',
      createdById: users.anna.id,
      assignedToId: users.marc.id,
      lastContactedAt: new Date('2026-06-09T15:30:00.000Z'),
      nextFollowUpAt: new Date('2026-07-02T10:00:00.000Z'),
    },
  });

  const casaBonay = await prisma.business.create({
    data: {
      id: businessIds.casaBonay,
      name: 'Casa Bonay',
      category: Category.hotel,
      status: BusinessStatus.meeting_scheduled,
      priority: Priority.high,
      source: LeadSource.referral,
      instagram: '@casabonay',
      email: 'partnerships@casabonay.dev',
      phone: '+34 600 100 004',
      website: 'https://casabonay.dev',
      address: 'Gran Via de les Corts Catalanes, Barcelona',
      notes: 'Meeting scheduled with partnerships team.',
      createdById: users.anna.id,
      assignedToId: users.nil.id,
      lastContactedAt: new Date('2026-06-10T09:45:00.000Z'),
      nextFollowUpAt: new Date('2026-07-01T16:00:00.000Z'),
    },
  });

  const holmesPlace = await prisma.business.create({
    data: {
      id: businessIds.holmesPlace,
      name: 'Holmes Place Balmes',
      category: Category.gym,
      status: BusinessStatus.proposal_sent,
      priority: Priority.medium,
      source: LeadSource.website,
      instagram: '@holmesplace_es',
      email: 'balmes@holmesplace.dev',
      phone: '+34 600 100 005',
      website: 'https://holmesplace.dev',
      address: 'Carrer de Balmes, Barcelona',
      notes: 'Proposal sent. Waiting for management review.',
      createdById: users.anna.id,
      assignedToId: users.julia.id,
      lastContactedAt: new Date('2026-06-12T13:00:00.000Z'),
      nextFollowUpAt: new Date('2026-07-10T09:00:00.000Z'),
    },
  });

  const blowHairSalon = await prisma.business.create({
    data: {
      id: businessIds.blowHairSalon,
      name: 'Blow Hair Salon',
      category: Category.hairdresser,
      status: BusinessStatus.new_lead,
      priority: Priority.medium,
      source: LeadSource.walk_in,
      instagram: '@blowhairsalon',
      email: 'hello@blowhair.dev',
      phone: '+34 600 100 006',
      website: 'https://blowhair.dev',
      address: 'Gràcia, Barcelona',
      notes: 'Found during street prospecting route. Not assigned yet.',
      createdById: users.anna.id,
      assignedToId: null,
      lastContactedAt: null,
      nextFollowUpAt: null,
    },
  });

  const greenVita = await prisma.business.create({
    data: {
      id: businessIds.greenVita,
      name: 'GreenVita Diagonal',
      category: Category.restaurant,
      status: BusinessStatus.waiting_response,
      priority: Priority.low,
      source: LeadSource.google_maps,
      instagram: '@greenvita',
      email: 'diagonal@greenvita.dev',
      phone: '+34 600 100 007',
      website: 'https://greenvita.dev',
      address: 'Avinguda Diagonal, Barcelona',
      notes: 'Healthy food chain. Contacted by email.',
      createdById: users.anna.id,
      assignedToId: users.laura.id,
      lastContactedAt: new Date('2026-06-14T10:15:00.000Z'),
      nextFollowUpAt: new Date('2026-07-11T11:30:00.000Z'),
    },
  });

  const bravissimo = await prisma.business.create({
    data: {
      id: businessIds.bravissimo,
      name: 'Bravissimo Barcelona',
      category: Category.shop,
      status: BusinessStatus.lost,
      priority: Priority.low,
      source: LeadSource.existing_contact,
      instagram: '@bravissimo',
      email: 'barcelona@bravissimo.dev',
      phone: '+34 600 100 008',
      website: 'https://bravissimo.dev',
      address: 'Centre, Barcelona',
      notes: 'Not interested for now. Could be revisited next year.',
      createdById: users.anna.id,
      assignedToId: users.nil.id,
      lastContactedAt: new Date('2026-06-01T16:30:00.000Z'),
      nextFollowUpAt: null,
    },
  });

  const cooltra = await prisma.business.create({
    data: {
      id: businessIds.cooltra,
      name: 'Cooltra Barcelona',
      category: Category.other,
      status: BusinessStatus.negotiating,
      priority: Priority.high,
      source: LeadSource.referral,
      instagram: '@cooltra',
      email: 'partners@cooltra.dev',
      phone: '+34 600 100 009',
      website: 'https://cooltra.dev',
      address: 'Barcelona',
      notes: 'Potential partnership. Negotiating scope and budget.',
      createdById: users.anna.id,
      assignedToId: users.marc.id,
      lastContactedAt: new Date('2026-06-16T17:00:00.000Z'),
      nextFollowUpAt: new Date('2026-07-03T10:30:00.000Z'),
    },
  });

  const drBloomClinic = await prisma.business.create({
    data: {
      id: businessIds.drBloomClinic,
      name: 'Dr. Bloom Clinic',
      category: Category.clinic,
      status: BusinessStatus.recontact_later,
      priority: Priority.medium,
      source: LeadSource.instagram,
      instagram: '@drbloomclinic',
      email: 'info@drbloom.dev',
      phone: '+34 600 100 010',
      website: 'https://drbloom.dev',
      address: 'Eixample, Barcelona',
      notes: 'Interested, but asked to reconnect later.',
      createdById: users.anna.id,
      assignedToId: users.julia.id,
      lastContactedAt: new Date('2026-06-18T12:00:00.000Z'),
      nextFollowUpAt: new Date('2026-08-01T09:00:00.000Z'),
    },
  });

  const veritas = await prisma.business.create({
    data: {
      id: businessIds.veritas,
      name: 'Veritas Barcelona',
      category: Category.shop,
      status: BusinessStatus.discarded,
      priority: Priority.low,
      source: LeadSource.google_maps,
      instagram: '@veritas',
      email: 'contact@veritas.dev',
      phone: '+34 600 100 011',
      website: 'https://veritas.dev',
      address: 'Barcelona',
      notes: 'Discarded for MVP demo. Not a priority segment.',
      createdById: users.anna.id,
      assignedToId: null,
      lastContactedAt: null,
      nextFollowUpAt: null,
    },
  });

  const ritualGym = await prisma.business.create({
    data: {
      id: businessIds.ritualGym,
      name: 'Ritual Gym Barcelona',
      category: Category.gym,
      status: BusinessStatus.assigned,
      priority: Priority.medium,
      source: LeadSource.website,
      instagram: '@ritualgym',
      email: 'barcelona@ritualgym.dev',
      phone: '+34 600 100 012',
      website: 'https://ritualgym.dev',
      address: 'Barcelona',
      notes: 'Assigned but not contacted yet.',
      createdById: users.anna.id,
      assignedToId: users.pau.id,
      lastContactedAt: null,
      nextFollowUpAt: new Date('2026-07-12T10:00:00.000Z'),
    },
  });

  return {
    federalCafe,
    parkingPizza,
    satansCoffee,
    casaBonay,
    holmesPlace,
    blowHairSalon,
    greenVita,
    bravissimo,
    cooltra,
    drBloomClinic,
    veritas,
    ritualGym,
  };
};

const seedActivities = async (
  users: Awaited<ReturnType<typeof seedUsers>>,
  businesses: Awaited<ReturnType<typeof seedBusinesses>>,
) => {
  await prisma.activity.createMany({
    data: [
      {
        businessId: businesses.federalCafe.id,
        userId: users.anna.id,
        type: ActivityType.business_created,
        notes: 'Business created from Instagram prospecting.',
        createdAt: new Date('2026-06-01T09:00:00.000Z'),
      },
      {
        businessId: businesses.federalCafe.id,
        userId: users.anna.id,
        type: ActivityType.business_assigned,
        notes: `Business assigned to ${users.marc.name}.`,
        metadata: {
          assignedToId: users.marc.id,
        },
        createdAt: new Date('2026-06-01T09:05:00.000Z'),
      },
      {
        businessId: businesses.federalCafe.id,
        userId: users.marc.id,
        type: ActivityType.instagram_message_sent,
        notes: 'Initial Instagram message sent.',
        metadata: {
          channel: 'instagram',
        },
        createdAt: new Date('2026-06-05T10:00:00.000Z'),
      },
      {
        businessId: businesses.federalCafe.id,
        userId: users.marc.id,
        type: ActivityType.status_changed,
        notes: 'Status changed from assigned to waiting_response.',
        metadata: {
          previousStatus: BusinessStatus.assigned,
          nextStatus: BusinessStatus.waiting_response,
        },
        createdAt: new Date('2026-06-05T10:01:00.000Z'),
      },

      {
        businessId: businesses.parkingPizza.id,
        userId: users.anna.id,
        type: ActivityType.business_created,
        notes: 'Business created from Google Maps prospecting.',
        createdAt: new Date('2026-06-02T10:00:00.000Z'),
      },
      {
        businessId: businesses.parkingPizza.id,
        userId: users.anna.id,
        type: ActivityType.business_assigned,
        notes: `Business assigned to ${users.laura.name}.`,
        metadata: {
          assignedToId: users.laura.id,
        },
        createdAt: new Date('2026-06-02T10:05:00.000Z'),
      },
      {
        businessId: businesses.parkingPizza.id,
        userId: users.laura.id,
        type: ActivityType.email_sent,
        notes: 'Sent first email with short introduction.',
        metadata: {
          channel: 'email',
        },
        createdAt: new Date('2026-06-07T11:00:00.000Z'),
      },
      {
        businessId: businesses.parkingPizza.id,
        userId: users.laura.id,
        type: ActivityType.dossier_sent,
        notes: 'Commercial dossier sent by email.',
        createdAt: new Date('2026-06-07T11:10:00.000Z'),
      },
      {
        businessId: businesses.parkingPizza.id,
        userId: users.laura.id,
        type: ActivityType.status_changed,
        notes: 'Status changed from waiting_response to dossier_sent.',
        metadata: {
          previousStatus: BusinessStatus.waiting_response,
          nextStatus: BusinessStatus.dossier_sent,
        },
        createdAt: new Date('2026-06-07T11:11:00.000Z'),
      },

      {
        businessId: businesses.satansCoffee.id,
        userId: users.anna.id,
        type: ActivityType.business_created,
        notes: 'Business created from Instagram prospecting.',
        createdAt: new Date('2026-06-03T09:00:00.000Z'),
      },
      {
        businessId: businesses.satansCoffee.id,
        userId: users.marc.id,
        type: ActivityType.instagram_message_sent,
        notes: 'Sent a direct message on Instagram.',
        metadata: {
          channel: 'instagram',
        },
        createdAt: new Date('2026-06-09T15:00:00.000Z'),
      },
      {
        businessId: businesses.satansCoffee.id,
        userId: users.marc.id,
        type: ActivityType.response_received,
        notes: 'They replied positively and asked for more details.',
        createdAt: new Date('2026-06-09T15:30:00.000Z'),
      },
      {
        businessId: businesses.satansCoffee.id,
        userId: users.marc.id,
        type: ActivityType.status_changed,
        notes: 'Status changed from waiting_response to interested.',
        metadata: {
          previousStatus: BusinessStatus.waiting_response,
          nextStatus: BusinessStatus.interested,
        },
        createdAt: new Date('2026-06-09T15:31:00.000Z'),
      },

      {
        businessId: businesses.casaBonay.id,
        userId: users.nil.id,
        type: ActivityType.meeting_scheduled,
        notes: 'Meeting scheduled with partnerships team.',
        metadata: {
          meetingDate: '2026-07-01T16:00:00.000Z',
        },
        createdAt: new Date('2026-06-10T09:45:00.000Z'),
      },
      {
        businessId: businesses.holmesPlace.id,
        userId: users.julia.id,
        type: ActivityType.meeting_done,
        notes: 'Discovery meeting completed.',
        createdAt: new Date('2026-06-12T12:30:00.000Z'),
      },
      {
        businessId: businesses.holmesPlace.id,
        userId: users.julia.id,
        type: ActivityType.proposal_sent,
        notes: 'Proposal sent after discovery call.',
        createdAt: new Date('2026-06-12T13:00:00.000Z'),
      },

      {
        businessId: businesses.cooltra.id,
        userId: users.marc.id,
        type: ActivityType.priority_changed,
        notes: 'Priority changed from medium to high.',
        metadata: {
          previousPriority: Priority.medium,
          nextPriority: Priority.high,
        },
        createdAt: new Date('2026-06-16T17:00:00.000Z'),
      },
      {
        businessId: businesses.cooltra.id,
        userId: users.marc.id,
        type: ActivityType.note_added,
        notes: 'Potential partnership account. Keep close follow-up.',
        createdAt: new Date('2026-06-16T17:05:00.000Z'),
      },

      {
        businessId: businesses.bravissimo.id,
        userId: users.nil.id,
        type: ActivityType.response_received,
        notes: 'They are not interested at the moment.',
        createdAt: new Date('2026-06-01T16:30:00.000Z'),
      },
      {
        businessId: businesses.bravissimo.id,
        userId: users.nil.id,
        type: ActivityType.status_changed,
        notes: 'Status changed to lost.',
        metadata: {
          nextStatus: BusinessStatus.lost,
        },
        createdAt: new Date('2026-06-01T16:35:00.000Z'),
      },

      {
        businessId: businesses.drBloomClinic.id,
        userId: users.julia.id,
        type: ActivityType.phone_call_done,
        notes: 'Phone call completed. Asked to reconnect in August.',
        createdAt: new Date('2026-06-18T12:00:00.000Z'),
      },

      {
        businessId: businesses.ritualGym.id,
        userId: users.anna.id,
        type: ActivityType.business_assigned,
        notes: `Business assigned to ${users.pau.name}.`,
        metadata: {
          assignedToId: users.pau.id,
        },
        createdAt: new Date('2026-06-20T10:00:00.000Z'),
      },
    ],
  });
};

const seedFollowUps = async (
  users: Awaited<ReturnType<typeof seedUsers>>,
  businesses: Awaited<ReturnType<typeof seedBusinesses>>,
) => {
  await prisma.followUp.createMany({
    data: [
      {
        businessId: businesses.federalCafe.id,
        assignedToId: users.marc.id,
        status: FollowUpStatus.pending,
        dueDate: new Date('2026-07-04T09:30:00.000Z'),
        note: 'Follow up after Instagram message.',
      },
      {
        businessId: businesses.parkingPizza.id,
        assignedToId: users.laura.id,
        status: FollowUpStatus.pending,
        dueDate: new Date('2026-07-08T12:00:00.000Z'),
        note: 'Ask if they reviewed the commercial dossier.',
      },
      {
        businessId: businesses.satansCoffee.id,
        assignedToId: users.marc.id,
        status: FollowUpStatus.pending,
        dueDate: new Date('2026-07-02T10:00:00.000Z'),
        note: 'Prepare proposal based on their reply.',
      },
      {
        businessId: businesses.casaBonay.id,
        assignedToId: users.nil.id,
        status: FollowUpStatus.pending,
        dueDate: new Date('2026-07-01T16:00:00.000Z'),
        note: 'Attend scheduled meeting.',
      },
      {
        businessId: businesses.holmesPlace.id,
        assignedToId: users.julia.id,
        status: FollowUpStatus.pending,
        dueDate: new Date('2026-07-10T09:00:00.000Z'),
        note: 'Follow up on proposal review.',
      },
      {
        businessId: businesses.greenVita.id,
        assignedToId: users.laura.id,
        status: FollowUpStatus.pending,
        dueDate: new Date('2026-07-11T11:30:00.000Z'),
        note: 'Second email if no response.',
      },
      {
        businessId: businesses.cooltra.id,
        assignedToId: users.marc.id,
        status: FollowUpStatus.pending,
        dueDate: new Date('2026-07-03T10:30:00.000Z'),
        note: 'Send negotiation summary.',
      },
      {
        businessId: businesses.drBloomClinic.id,
        assignedToId: users.julia.id,
        status: FollowUpStatus.pending,
        dueDate: new Date('2026-08-01T09:00:00.000Z'),
        note: 'Reconnect in August as requested.',
      },
      {
        businessId: businesses.ritualGym.id,
        assignedToId: users.pau.id,
        status: FollowUpStatus.pending,
        dueDate: new Date('2026-07-12T10:00:00.000Z'),
        note: 'Make first contact.',
      },
      {
        businessId: businesses.bravissimo.id,
        assignedToId: users.nil.id,
        status: FollowUpStatus.done,
        dueDate: new Date('2026-06-03T10:00:00.000Z'),
        completedAt: new Date('2026-06-03T10:45:00.000Z'),
        note: 'Confirm final decision after response.',
      },
      {
        businessId: businesses.veritas.id,
        assignedToId: users.anna.id,
        status: FollowUpStatus.cancelled,
        dueDate: new Date('2026-06-20T10:00:00.000Z'),
        note: 'Cancelled because business was discarded.',
      },
    ],
  });
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
