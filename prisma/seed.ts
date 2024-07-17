import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const initialUser = await prisma.user.upsert({
    where: {
      id: '62b6a104-6f6e-44e2-b610-801b5e103b29',
    },
    update: {},
    create: {
      name: 'Initial User',
      email: 'hello@glow.as',
      emailVerified: new Date(),
      isAdmin: true,
    },
  });

  // Default Theme
  await prisma.theme.upsert({
    where: {
      id: '00441c91-6762-44d8-8110-2b5616825bd9',
    },
    update: {},
    create: {
      createdById: initialUser.id,
      colorBgPrimary: '0 0% 100%',
      colorBgSecondary: '0 0% 90.20%',
      colorLabelPrimary: '240deg 3.45% 11.37%',
      colorLabelSecondary: '0 0% 16%',
      colorBorderPrimary: '0deg 0% 91.76%',
      colorLabelTertiary: '0 0% 98.04%',
      colorBgBase: '60deg 4.76% 96%',
    },
  });

  // Purple Theme
  await prisma.theme.upsert({
    where: {
      id: '14fc9bdf-f363-4404-b05e-856670722fda',
    },
    update: {},
    create: {
      createdById: initialUser.id,
      colorBgPrimary: '255deg 29% 13.5%',
      colorBgSecondary: '0 0% 0%',
      colorLabelPrimary: '0 0% 100%',
      colorLabelSecondary: '293.33 7.44% 76.27%',
      colorBorderPrimary: '253.55deg 19.69% 28.37%',
      colorLabelTertiary: '0 0% 98.04%',
      colorBgBase: '255.48 30.10% 20.20%',
    },
  });

  // Black Theme
  await prisma.theme.upsert({
    where: {
      id: '1e24ab02-9b97-4a61-9b83-fe278a41b30b',
    },
    update: {},
    create: {
      createdById: initialUser.id,
      colorBgPrimary: '0 0% 0%',
      colorBgSecondary: '0 0% 90.20%',
      colorLabelPrimary: '0 0% 100%',
      colorLabelSecondary: '0 0% 98.04%',
      colorBorderPrimary: '0 0% 16.07%',
      colorLabelTertiary: '0 0% 98.04%',
      colorBgBase: '0 0% 0%',
    },
  });

  // Forest Theme
  await prisma.theme.upsert({
    where: {
      id: '4c47b21f-9183-4e7a-be6c-6ee4fabae92a',
    },
    update: {},
    create: {
      createdById: initialUser.id,
      colorBgPrimary: '140deg 9.88% 31%',
      colorBgSecondary: '0 0% 90.20%',
      colorLabelPrimary: '0 0% 100%',
      colorLabelSecondary: '141.18deg 41.46% 83.92%',
      colorBorderPrimary: '140deg 9.88% 31%',
      colorLabelTertiary: '0 0% 98.04%',
      colorBgBase: '141.18deg 8.13% 41%',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
