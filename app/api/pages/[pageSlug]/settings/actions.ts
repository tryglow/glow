'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function getPageSettings({
  slug,
  domain,
}: {
  slug?: string;
  domain?: string;
}) {
  const session = await auth();

  if (!session) {
    return null;
  }

  const page = await prisma.page.findUnique({
    where: {
      deletedAt: null,
      slug,
      customDomain: domain ? decodeURIComponent(domain) : undefined,
      team: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    select: {
      id: true,
      publishedAt: true,
      slug: true,
      metaTitle: true,
      metaDescription: true,
      backgroundImage: true,
      themeId: true,
    },
  });

  if (!page) {
    return {
      error: {
        message: 'Page not found',
      },
    };
  }

  return page;
}
