import { auth } from '@/lib/auth';
import { createNewPage } from '@/lib/page';
import prisma from '@/lib/prisma';
import { isForbiddenSlug, isReservedSlug, regexSlug } from '@/lib/slugs';

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return Response.json(
      {
        error: {
          message: 'Unauthorized',
          label: 'Sorry, you must be logged in to do that.',
        },
      },
      {
        status: 401,
      }
    );
  }

  const bodyData = await req.json();

  const { slug, themeId } = bodyData;

  if (!slug) {
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    });
  }

  const existingPage = await prisma.page.findUnique({
    where: {
      deletedAt: null,
      slug,
    },
  });

  if (!slug.match(regexSlug)) {
    return Response.json({
      error: {
        message: 'Slug is invalid',
        field: 'pageSlug',
      },
    });
  }

  if (isForbiddenSlug(slug)) {
    return Response.json({
      error: {
        message: 'Slug is forbidden',
        field: 'pageSlug',
      },
    });
  }

  if (isReservedSlug(slug)) {
    return Response.json({
      error: {
        message: 'Slug is reserved - reach out on twitter to request this',
        field: 'pageSlug',
      },
    });
  }

  if (existingPage) {
    return Response.json({
      error: {
        message: 'Page with this slug already exists',
        field: 'pageSlug',
      },
    });
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
      return Response.json({
        error: {
          message: 'You have reached the maximum number of pages',
          label: 'Please upgrade your plan to create more pages',
        },
      });
    }
  }

  const newPage = await createNewPage({ slug, themeId });

  if (newPage) {
    return Response.json({
      data: {
        page: newPage,
      },
    });
  }

  return Response.json({
    error: {
      message: 'Unable to create page',
    },
  });
}
