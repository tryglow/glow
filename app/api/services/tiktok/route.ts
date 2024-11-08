import { auth } from '@/app/lib/auth';
import { encrypt } from '@/lib/encrypt';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

const scopes = [
  'user.info.basic',
  'user.info.profile',
  'user.info.stats',
  'video.list',
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const blockId = searchParams.get('blockId');

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
    state: await encrypt({
      userId: session.user.id,
      blockId,
    }),
  }).toString();

  url.search = qs;

  redirect(url.toString());
}
