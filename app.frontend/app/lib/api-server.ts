import { getUserJwt } from '@/app/lib/auth';

export const apiServerFetch = async (
  path: string,
  requestOptions: RequestInit = {}
) => {
  let jwt;
  const headers: Record<string, string> =
    (requestOptions.headers as Record<string, string>) || {};

  jwt = await getUserJwt();

  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    headers,
    body: requestOptions.body,
    ...requestOptions,
  });
};
