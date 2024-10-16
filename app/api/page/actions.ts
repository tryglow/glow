'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

async function checkUserHasEditAccess(slug: string) {
  const session = await auth();

  if (!session) {
    return false;
  }

  const page = await prisma.page.findUnique({
    where: {
      slug,
      team: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
  });

  return !!page;
}

export async function deletePage(slug: string) {
  const session = await auth();

  if (!session) {
    return {
      error: 'Unauthorized',
    };
  }

  const hasEditAccess = await checkUserHasEditAccess(slug);

  if (!hasEditAccess) {
    return {
      error: 'You do not have access to delete this page',
    };
  }

  try {
    await prisma.page.update({
      where: {
        slug,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      error: 'Something went wrong',
    };
  }
}
