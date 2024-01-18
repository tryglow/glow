import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { isForbiddenSlug, isReservedSlug } from '@/lib/slugs';
import { createNewPage } from '@/lib/page';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({
      message: 'error',
      data: null,
    });
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
