'use server';

import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

export async function getPageLayout({
  slug,
  domain,
}: {
  slug?: string;
  domain?: string;
}) {
  const session = await auth();

  const tag = slug ? slug : domain?.replace('.', '-').replace('-', '_');

  const page = await prisma.page.findUnique({
    where: {
      deletedAt: null,
      slug,
      customDomain: domain ? decodeURIComponent(domain) : undefined,
    },
    cacheStrategy: session
      ? {
          swr: 120,
          tags: [`page_${tag}__layout`],
        }
      : undefined,
  });

  if (!page) {
    return null;
  }

  if (!page?.publishedAt && page.teamId !== session?.currentTeamId) {
    return null;
  }

  return { sm: page.config, xxs: page.mobileConfig };
}
