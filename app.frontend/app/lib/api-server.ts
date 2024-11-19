import { getUserJwt } from '@/app/lib/auth';

export const apiServerFetch = async (
  path: string,
  requestOptions: RequestInit = {},
  options?: {
    requiresAuth?: boolean;
  }
) => {
  let jwt;

  if (options?.requiresAuth) {
    jwt = await getUserJwt();

    if (!jwt) {
      throw new Error('No JWT found');
    }
  }

  const headers: Record<string, string> = requestOptions.headers as Record<
    string,
    string
  >;

  if (options?.requiresAuth) {
    headers.Authorization = `Bearer ${jwt}`;
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    headers,
    body: requestOptions.body,
    ...requestOptions,
  });
};
