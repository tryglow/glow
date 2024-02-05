import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({
      message: 'error',
      data: null,
    });
  }

  const bodyData = await req.json();

  const { pageSlug, newLayout } = bodyData;

  if (!pageSlug || !newLayout) {
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    });
  }

  const page = await prisma.page.findUnique({
    where: {
      userId: session.user.id,
      slug: pageSlug,
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
      slug: pageSlug,
    },
    data: {
      config: newLayout.sm,
      mobileConfig: newLayout.xxs,
    },
    select: {
      id: true,
    },
  });

  return Response.json({
    data: updatedPage,
  });
}
