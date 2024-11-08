import { encrypt } from '@/lib/encrypt';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const blockId = searchParams.get('blockId');

  if (!process.env.THREADS_CALLBACK_URL) {
    throw new Error('Missing THREADS_CALLBACK_URL');
  }

  if (!process.env.THREADS_CLIENT_ID) {
    throw new Error('Missing THREADS_CLIENT_ID');
  }

  const options = {
    client_id: process.env.THREADS_CLIENT_ID,
    redirect_uri: process.env.THREADS_CALLBACK_URL,
    scope: 'threads_basic,threads_manage_insights',
    response_type: 'code',
    state: await encrypt({
      blockId,
    }),
  };

  const qs = new URLSearchParams(options).toString();
  redirect(`https://threads.net/oauth/authorize?${qs}`);
}
