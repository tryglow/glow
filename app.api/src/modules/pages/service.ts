import prisma from '../../lib/prisma';

export async function getPageLayoutById(pageId: string) {
  const page = await prisma.page.findUnique({
    where: {
      id: pageId,
    },
    select: {
      config: true,
      mobileConfig: true,
      publishedAt: true,
      teamId: true,
    },
  });

  return page;
}

export async function getPageThemeById(pageId: string) {
  const page = await prisma.page.findUnique({
    where: {
      deletedAt: null,
      id: pageId,
    },
    select: {
      theme: true,
      backgroundImage: true,
      publishedAt: true,
      teamId: true,
    },
  });

  return page;
}

export async function getPageIdBySlugOrDomain(slug: string, domain: string) {
  if (!slug && !domain) {
    return null;
  }

  const page = await prisma.page.findFirst({
    where: {
      slug,
      customDomain: domain ? decodeURIComponent(domain) : undefined,
    },
    select: {
      id: true,
    },
  });

  return page?.id;
}

export async function getPageBlocks(pageId: string) {
  const page = await prisma.page.findUnique({
    where: {
      id: pageId,
      deletedAt: null,
    },
    select: {
      teamId: true,
      publishedAt: true,
      blocks: {
        select: {
          id: true,
          data: true,
          type: true,
          config: true,
          integrationId: true,
        },
      },
    },
  });

  return page;
}

export async function getPagesForTeamId(teamId: string) {
  const pages = await prisma.page.findMany({
    where: {
      teamId,
      deletedAt: null,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  return pages;
}

export async function getPageSettings(pageId: string) {
  const page = await prisma.page.findUnique({
    where: {
      deletedAt: null,
      id: pageId,
    },
    select: {
      teamId: true,
      id: true,
      publishedAt: true,
      slug: true,
      metaTitle: true,
      metaDescription: true,
      backgroundImage: true,
      themeId: true,
      verifiedAt: true,
    },
  });

  return page;
}

export async function updatePageLayout(
  pageId: string,
  newLayout: {
    sm: any;
    xxs: any;
  }
) {
  const updatedPage = await prisma.page.update({
    where: {
      id: pageId,
    },
    data: {
      config: newLayout.sm,
      mobileConfig: newLayout.xxs,
    },
    select: {
      id: true,
    },
  });

  return updatedPage;
}

export async function checkUserHasAccessToPage(pageId: string, userId: string) {
  const page = await prisma.page.count({
    where: {
      id: pageId,
      team: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
  });

  if (page > 0) {
    return true;
  }

  return false;
}
