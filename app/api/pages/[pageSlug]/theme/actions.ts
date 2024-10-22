import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function getPageTheme(pageSlug: string, domain: string) {
  const session = await auth();

  const useSlug =
    decodeURIComponent(domain) === process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  const page = await prisma.page.findUnique({
    where: useSlug
      ? { slug: pageSlug, deletedAt: null }
      : { customDomain: decodeURIComponent(domain), deletedAt: null },
    select: {
      theme: true,
      backgroundImage: true,
      publishedAt: true,
      teamId: true,
    },
  });

  if (!page?.publishedAt && session?.currentTeamId !== page?.teamId) {
    return null;
  }

  return page;
}
