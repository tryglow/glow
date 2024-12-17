import { redirect } from 'next/navigation';

export async function GET() {
  if (!process.env.TIKTOK_CALLBACK_URL) {
    throw new Error('Missing TIKTOK_CALLBACK_URL');
  }

  if (!process.env.TIKTOK_CLIENT_KEY) {
    throw new Error('Missing TIKTOK_CLIENT_KEY');
  }

  const options = {
    client_key: process.env.TIKTOK_CLIENT_KEY,
    redirect_uri: process.env.TIKTOK_CALLBACK_URL,
    scope: 'user.info.basic,user.info.profile,user.info.stats,video.list',
    response_type: 'code',
  };

  const qs = new URLSearchParams(options).toString();
  redirect(`https://www.tiktok.com/v2/auth/authorize?${qs}`);
}
