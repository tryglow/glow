import { encrypt } from '@/lib/encrypt';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const blockId = searchParams.get('blockId');

  if (!process.env.INSTAGRAM_CALLBACK_URL) {
    throw new Error('Missing INSTAGRAM_CALLBACK_URL');
  }

  if (!process.env.INSTAGRAM_CLIENT_ID) {
    throw new Error('Missing INSTAGRAM_CLIENT_ID');
  }

  const options = {
    client_id: process.env.INSTAGRAM_CLIENT_ID,
    redirect_uri: process.env.INSTAGRAM_CALLBACK_URL,
    scope: 'user_profile,user_media',
    response_type: 'code',
    state: await encrypt({
      blockId,
    }),
  };

  const qs = new URLSearchParams(options).toString();
  redirect(`https://api.instagram.com/oauth/authorize?${qs}`);
}
