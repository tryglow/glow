import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

export async function getPageTheme({
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
    select: {
      theme: true,
      backgroundImage: true,
      publishedAt: true,
      teamId: true,
    },
    cacheStrategy: {
      swr: session ? 0 : 120,
      tags: [`page_${tag}__theme`],
    },
  });

  if (!page?.publishedAt && session?.currentTeamId !== page?.teamId) {
    return null;
  }

  return page;
}
