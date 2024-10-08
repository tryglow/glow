import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { isForbiddenSlug, isReservedSlug } from '@/lib/slugs';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({
      message: 'error',
      data: null,
    });
  }

  const bodyData = await req.json();

  const {
    currentPageSlug,
    pageSlug,
    metaTitle,
    themeId,
    published,
    backgroundImage,
  } = bodyData;

  if (!pageSlug || !metaTitle) {
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    });
  }

  if (currentPageSlug !== pageSlug) {
    const existingPage = await prisma.page.findUnique({
      where: {
        slug: pageSlug,
      },
    });

    if (isForbiddenSlug(pageSlug)) {
      return Response.json({
        error: {
          message: 'Slug is forbidden',
          field: 'pageSlug',
        },
      });
    }

    if (isReservedSlug(pageSlug)) {
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
  }

  const page = await prisma.page.findUnique({
    where: {
      team: {
        id: session.currentTeamId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      slug: currentPageSlug,
    },
  });

  if (!page) {
    return Response.json({
      error: {
        message: 'Page not found',
      },
    });
  }

  const updatedPage = await prisma.page.update({
    where: {
      slug: currentPageSlug,
    },
    data: {
      metaTitle,
      slug: pageSlug,
      publishedAt: published ? new Date() : null,
      themeId,
      backgroundImage,
    },
    select: {
      id: true,
    },
  });

  return Response.json({
    data: {
      page: updatedPage,
    },
  });
}
