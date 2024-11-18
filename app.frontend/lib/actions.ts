import { getUserJwt } from '@/app/lib/auth';

export async function getEnabledBlocks() {
  const jwt = await getUserJwt();

  if (!jwt) {
    return null;
  }

  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blocks/enabled-blocks`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  const data = await req.json();

  return data;
}
