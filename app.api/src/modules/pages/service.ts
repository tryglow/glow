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
