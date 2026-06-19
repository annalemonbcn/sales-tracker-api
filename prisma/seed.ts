import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { env } from '../src/config/env.js';

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.user.upsert({
    where: {
      email: 'anna@example.com',
    },
    update: {},
    create: {
      name: 'Anna',
      email: 'anna@example.com',
      role: 'admin',
    },
  });

  await prisma.user.upsert({
    where: {
      email: 'marta@example.com',
    },
    update: {},
    create: {
      name: 'Marta',
      email: 'marta@example.com',
      role: 'commercial',
    },
  });

  await prisma.user.upsert({
    where: {
      email: 'carla@example.com',
    },
    update: {},
    create: {
      name: 'Carla',
      email: 'carla@example.com',
      role: 'commercial',
    },
  });

  console.log('Seed completed');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
