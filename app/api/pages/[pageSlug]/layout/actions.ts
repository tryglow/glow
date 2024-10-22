import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function getPageLayout(pageSlug: string) {
  const session = await auth();

  if (!pageSlug) {
    return null;
  }

  const page = await prisma.page.findUnique({
    where: {
      deletedAt: null,
      slug: pageSlug,
    },
  });

  if (!page) {
    return null;
  }

  if (!page?.publishedAt && page.teamId !== session?.currentTeamId) {
    return null;
  }

  return { sm: page.config, xxs: page.mobileConfig };
}
