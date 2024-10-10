import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all of the users
// Get all of the integrations for each user
// Get the first team for each user
// Update the integration with the teamId

async function main() {
  await prisma.$transaction(async (tx) => {
    // Get all of the users
    const users = await tx.user.findMany({
      include: {
        teams: true,
      },
    });

    for (const user of users) {
      const integrations = await tx.integration.findMany({
        where: {
          userId: user.id,
        },
      });

      for (const integration of integrations) {
        await tx.integration.update({
          where: {
            id: integration.id,
          },
          data: {
            teamId: user.teams[0].teamId,
          },
        });
      }
    }
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
