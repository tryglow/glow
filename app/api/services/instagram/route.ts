import { redirect } from 'next/navigation';

export async function GET() {
  if (!process.env.INSTAGRAM_CALLBACK_URL) {
    throw new Error('Missing INSTAGRAM_CALLBACK_URL');
  }

  if (!process.env.INSTAGRAM_CLIENT_ID) {
    throw new Error('Missing INSTAGRAM_CLIENT_ID');
  }

  const options = {
    client_id: process.env.INSTAGRAM_CLIENT_ID,
    redirect_uri: process.env.INSTAGRAM_CALLBACK_URL,
    // scope: 'user_profile,user_media',
    scope: 'instagram_business_basic,instagram_business_content_publish,instagram_business_manage_messages,instagram_business_manage_comments',
    response_type: 'code',
  };

  const qs = new URLSearchParams(options).toString();
  redirect(`https://api.instagram.com/oauth/authorize?${qs}`);
}
