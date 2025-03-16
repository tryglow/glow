export const apiServerFetch = async (
  path: string,
  requestOptions: RequestInit = {}
) => {
  const headers: Record<string, string> = (requestOptions.headers as Record<
    string,
    string
  >) || {
    'Content-Type': 'application/json',
    'x-api-key': process.env.INTERNAL_API_KEY,
  };

  console.log(
    'process.env.NEXT_PUBLIC_API_URL',
    process.env.NEXT_PUBLIC_API_URL
  );

  return fetch(`https://api.lin.ky${path}`, {
    headers,
    body: requestOptions.body,
    ...requestOptions,
  });
};
