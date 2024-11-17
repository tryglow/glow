import { encrypt } from '@/lib/encrypt';
import { NextRequest } from 'next/dist/server/web/spec-extension/request';
import { redirect } from 'next/navigation';

const url = 'https://accounts.spotify.com/authorize';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const blockId = searchParams.get('blockId');
  if (!process.env.SPOTIFY_CLIENT_ID) {
    throw new Error('Missing SPOTIFY_CLIENT_ID');
  }

  if (!process.env.SPOTIFY_REDIRECT_URI) {
    throw new Error('Missing SPOTIFY_REDIRECT_URI');
  }

  const query = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    scope: 'user-read-currently-playing, user-read-recently-played',
    state: await encrypt({
      blockId,
    }),
  });

  redirect(`${url}?${query}`);
}
