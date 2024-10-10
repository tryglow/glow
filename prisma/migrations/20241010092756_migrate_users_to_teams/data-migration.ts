import Prisma from '@prisma/client';

const prisma = new Prisma.PrismaClient();
async function main() {
  await prisma.$transaction(
    async (tx) => {
      // Get all of the users
      const users = await tx.user.findMany();

      for (const user of users) {
        // Create a new team for each user
        const newTeam = await tx.team.create({
          data: {
            name: 'Default Team',
            members: {
              create: {
                userId: user.id,
              },
            },
          },
        });

        // Get all of the pages for the user
        const pages = await tx.page.findMany({
          where: {
            userId: user.id,
          },
        });

        // Update the page with the teamId
        for (const page of pages) {
          await tx.page.update({
            where: {
              id: page.id,
            },
            data: {
              teamId: newTeam.id,
            },
          });
        }
      }
    },
    {
      maxWait: 5000, // 5 seconds max wait to connect to prisma
      timeout: 20000, // 20 seconds
    }
  );
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
