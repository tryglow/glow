import { apiServerFetch } from '@/app/lib/api-server';
import prisma from '@/lib/prisma';

export async function getPageIdBySlugOrDomain(slug: string, domain: string) {
  const customDomain =
    decodeURIComponent(domain) !== process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  const page = await prisma.page.findFirst({
    where: {
      slug: customDomain ? undefined : slug,
      customDomain: customDomain ? decodeURIComponent(domain) : undefined,
    },
    select: {
      id: true,
      teamId: true,
      publishedAt: true,
    },
  });

  return page;
}

export async function getPageTheme(pageId: string) {
  const res = await apiServerFetch(`/pages/${pageId}/theme`, {
    method: 'GET',
  });

  const data = await res.json();

  return data;
}

export async function getPageLayout(pageId: string) {
  const res = await apiServerFetch(`/pages/${pageId}/layout`, {
    method: 'GET',
  });

  const data = await res.json();

  return data;
}

export async function getPageSettings(pageId: string) {
  const res = await apiServerFetch(`/pages/${pageId}/settings`, {
    method: 'GET',
  });

  const data = await res.json();

  return data;
}

export async function getPageBlocks(pageId: string) {
  const res = await apiServerFetch(`/pages/${pageId}/blocks`, {
    method: 'GET',
  });

  const data = await res.json();

  return data;
}
