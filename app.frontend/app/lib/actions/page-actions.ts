import { apiServerFetch } from '@/app/lib/api-server';

export async function getPageIdBySlugOrDomain(slug: string, domain: string) {
  const customDomain =
    decodeURIComponent(domain) !== process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  const res = await apiServerFetch(`/pages/get-page-id`, {
    method: 'POST',
    body: JSON.stringify({
      slug: customDomain ? undefined : slug,
      domain: customDomain ? domain : undefined,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: 500,
    },
  });

  const data = await res.json();

  return data.pageId;
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

export async function getPageBlocks(pageId: string) {
  const res = await apiServerFetch(`/pages/${pageId}/blocks`, {
    method: 'GET',
  });

  const data = await res.json();

  return data;
}
