import { Prisma } from '@prisma/client';

import prisma from '../../../lib/prisma';

async function main() {
  await prisma.$transaction(
    async (tx) => {
      console.log('Starting migration');
      // Get all of the users
      const users = await tx.user.findMany();

      console.log('Users', users.length);

      for (const user of users) {
        console.log('Migrating for user', user.id);
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

        console.log('Pages for user', pages.length);

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
      maxWait: 20000, // 10 seconds max wait to connect to prisma
      timeout: 120000, // 2 minutes
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    }
  );
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
