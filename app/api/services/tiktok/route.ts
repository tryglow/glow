import { auth } from '@/app/lib/auth';
import { encrypt } from '@/lib/encrypt';
import { redirect } from 'next/navigation';

const scopes = [
  'user.info.basic',
  'user.info.profile',
  'user.info.stats',
  'video.list',
];

export async function GET() {
  const session = await auth();

  if (!session) {
    return Response.json({
      error: 'Unauthorized',
    });
  }

  if (!process.env.TIKTOK_CALLBACK_URL) {
    throw new Error('Missing TIKTOK_CALLBACK_URL');
  }

  if (!process.env.TIKTOK_CLIENT_KEY) {
    throw new Error('Missing TIKTOK_CLIENT_KEY');
  }

  const url = new URL('https://www.tiktok.com/v2/auth/authorize');

  const qs = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY,
    redirect_uri: process.env.TIKTOK_CALLBACK_URL,
    scope: scopes.join(','),
    response_type: 'code',
    // This is used to confirm the request has not been tampered with, when we
    // receive the callback.
    state: await encrypt(session.user.id),
  }).toString();

  url.search = qs;

  redirect(url.toString());
}
