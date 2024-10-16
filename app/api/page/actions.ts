'use server';

import { auth } from '@/lib/auth';
import { createNewPage } from '@/lib/page';
import prisma from '@/lib/prisma';
import { isForbiddenSlug, isReservedSlug, regexSlug } from '@/lib/slugs';

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

export async function createPage({
  slug,
  themeId,
}: {
  slug: string;
  themeId: string;
}) {
  const session = await auth();

  if (!session) {
    return {
      error: {
        message: 'Unauthorized',
        label: 'Sorry, you must be logged in to do that.',
      },
    };
  }

  if (!slug) {
    return {
      error: {
        message: 'Missing required fields',
      },
    };
  }

  const existingPage = await prisma.page.findUnique({
    where: {
      deletedAt: null,
      slug,
    },
  });

  if (!slug.match(regexSlug)) {
    return {
      error: {
        message: 'Slug is invalid',
        field: 'pageSlug',
      },
    };
  }

  if (isForbiddenSlug(slug)) {
    return {
      error: {
        message: 'Slug is forbidden',
        field: 'pageSlug',
      },
    };
  }

  if (isReservedSlug(slug)) {
    return {
      error: {
        message: 'Slug is reserved - reach out on twitter to request this',
        field: 'pageSlug',
      },
    };
  }

  if (existingPage) {
    return {
      error: {
        message: 'Page with this slug already exists',
        field: 'pageSlug',
      },
    };
  }

  const teamPages = await prisma.page.findMany({
    where: {
      deletedAt: null,
      team: {
        id: session.currentTeamId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    include: {
      user: {
        select: {
          isAdmin: true,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  const maxNumberOfPages =
    user?.hasPremiumAccess || user?.hasTeamAccess ? 1000 : 2;

  if (teamPages.length >= maxNumberOfPages) {
    if (!user?.isAdmin) {
      return {
        error: {
          message: 'You have reached the maximum number of pages',
          label: 'Please upgrade your plan to create more pages',
        },
      };
    }
  }

  const newPage = await createNewPage({ slug, themeId });

  if (newPage) {
    return {
      data: {
        page: newPage,
      },
    };
  }

  return {
    error: {
      message: 'Unable to create page',
    },
  };
}
