import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const initialTeam = await prisma.team.upsert({
    where: {
      id: '01929fe6-7ade-7dd9-b5ca-26ef831c2914',
    },
    update: {},
    create: {
      name: 'Initial Team',
      isPersonal: true,
    },
  });

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

      teams: {
        create: {
          teamId: initialTeam.id,
        },
      },
    },
  });

  // Default Theme
  await prisma.theme.upsert({
    where: {
      id: '00441c91-6762-44d8-8110-2b5616825bd9',
    },
    update: {},
    create: {
      id: '00441c91-6762-44d8-8110-2b5616825bd9',
      name: 'Default',
      createdById: initialUser.id,
      isDefault: true,
      colorBgPrimary: {
        h: 0,
        s: 0,
        l: 100,
      },
      colorBgSecondary: {
        h: 0,
        s: 0,
        l: 90.2,
      },
      colorLabelPrimary: {
        h: 240,
        s: 3.45,
        l: 11.37,
      },
      colorLabelSecondary: {
        h: 0,
        s: 0,
        l: 16,
      },
      colorBorderPrimary: {
        h: 0,
        s: 0,
        l: 91.76,
      },
      colorLabelTertiary: {
        h: 0,
        s: 0,
        l: 98.04,
      },
      colorBgBase: {
        h: 60,
        s: 4.76,
        l: 96,
      },
    },
  });

  // Purple Theme
  await prisma.theme.upsert({
    where: {
      id: '14fc9bdf-f363-4404-b05e-856670722fda',
    },
    update: {},
    create: {
      id: '14fc9bdf-f363-4404-b05e-856670722fda',
      name: 'Purple',
      createdById: initialUser.id,
      isDefault: true,
      colorBgPrimary: {
        h: 255,
        s: 29,
        l: 13.5,
      },
      colorBgSecondary: {
        h: 0,
        s: 0,
        l: 0,
      },
      colorLabelPrimary: {
        h: 0,
        s: 0,
        l: 100,
      },
      colorLabelSecondary: {
        h: 293.33,
        s: 7.44,
        l: 76.27,
      },
      colorBorderPrimary: {
        h: 253.55,
        s: 19.69,
        l: 28.37,
      },
      colorLabelTertiary: {
        h: 0,
        s: 0,
        l: 98.04,
      },
      colorBgBase: {
        h: 255.48,
        s: 30.1,
        l: 20.2,
      },
    },
  });

  // Black Theme
  await prisma.theme.upsert({
    where: {
      id: '1e24ab02-9b97-4a61-9b83-fe278a41b30b',
    },
    update: {},
    create: {
      id: '1e24ab02-9b97-4a61-9b83-fe278a41b30b',
      name: 'Black',
      createdById: initialUser.id,
      isDefault: true,
      colorBgPrimary: {
        h: 0,
        s: 0,
        l: 0,
      },
      colorBgSecondary: {
        h: 0,
        s: 0,
        l: 90.2,
      },
      colorLabelPrimary: {
        h: 0,
        s: 0,
        l: 100,
      },
      colorLabelSecondary: {
        h: 0,
        s: 0,
        l: 98.04,
      },
      colorBorderPrimary: {
        h: 0,
        s: 0,
        l: 16.07,
      },
      colorLabelTertiary: {
        h: 0,
        s: 0,
        l: 98.04,
      },
      colorBgBase: {
        h: 0,
        s: 0,
        l: 0,
      },
    },
  });

  // Forest Theme
  await prisma.theme.upsert({
    where: {
      id: '4c47b21f-9183-4e7a-be6c-6ee4fabae92a',
    },
    update: {},
    create: {
      id: '4c47b21f-9183-4e7a-be6c-6ee4fabae92a',
      name: 'Forest',
      createdById: initialUser.id,
      isDefault: true,
      colorBgPrimary: {
        h: 140,
        s: 9.88,
        l: 31,
      },
      colorBgSecondary: {
        h: 0,
        s: 0,
        l: 90.2,
      },
      colorLabelPrimary: {
        h: 0,
        s: 0,
        l: 100,
      },
      colorLabelSecondary: {
        h: 141.18,
        s: 41.46,
        l: 83.92,
      },
      colorBorderPrimary: {
        h: 140,
        s: 9.88,
        l: 31,
      },
      colorLabelTertiary: {
        h: 0,
        s: 0,
        l: 98.04,
      },
      colorBgBase: {
        h: 141.18,
        s: 8.13,
        l: 41,
      },
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
