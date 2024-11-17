import { redirect } from 'next/navigation';

export async function GET() {
  if (!process.env.TWITTER_CLIENT_ID) {
    throw new Error('Missing TWITTER_CLIENT_ID');
  }

  if (!process.env.TWITTER_CLIENT_SECRET) {
    throw new Error('Missing TWITTER_CLIENT_SECRET');
  }

  if (!process.env.TWITTER_CALLBACK_URL) {
    throw new Error('Missing TWITTER_CALLBACK_URL');
  }

  if (!process.env.TWITTER_CHALLENGE) {
    throw new Error('Missing TWITTER_CHALLENGE');
  }

  const options = {
    redirect_uri: process.env.TWITTER_CALLBACK_URL,
    client_id: process.env.TWITTER_CLIENT_ID,
    state: 'state',
    response_type: 'code',
    code_challenge: process.env.TWITTER_CHALLENGE,
    code_challenge_method: 'plain',
    scope: ['users.read', 'tweet.read'].join(' '),
  };

  const qs = new URLSearchParams(options).toString();
  redirect(`https://twitter.com/i/oauth2/authorize?${qs}`);
}
