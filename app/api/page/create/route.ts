import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { isForbiddenSlug, isReservedSlug, regexSlug } from '@/lib/slugs';
import { MAX_PAGES_PER_USER, createNewPage } from '@/lib/page';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

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

  const { slug } = bodyData;

  if (!slug) {
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    });
  }

  const existingPage = await prisma.page.findUnique({
    where: {
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

  const usersPages = await prisma.page.findMany({
    where: {
      userId: session.user.id,
    },
  });

  if (usersPages.length >= MAX_PAGES_PER_USER) {
    return Response.json({
      error: {
        message: 'You have reached the maximum number of pages',
        label: 'Sorry, you can only create 2 pages per account.',
      },
    });
  }

  const newPage = await createNewPage(session.user.id, slug);

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
