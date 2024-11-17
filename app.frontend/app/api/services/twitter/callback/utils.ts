export async function requestToken({
  isRefreshToken,
  code,
}: {
  isRefreshToken?: boolean;
  code: string;
}) {
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

  const BasicAuthToken = Buffer.from(
    `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`,
    'utf8'
  ).toString('base64');

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${BasicAuthToken}`,
  };

  const options: any = {
    client_id: process.env.TWITTER_CLIENT_ID,
    redirect_uri: process.env.TWITTER_CALLBACK_URL,
    grant_type: isRefreshToken ? 'refresh_token' : 'authorization_code',
    code_verifier: process.env.TWITTER_CHALLENGE,
  };

  if (isRefreshToken) {
    options.refresh_token = code;
  } else {
    options.code = code;
  }

  const qs = new URLSearchParams(options).toString();

  return fetch(`https://api.twitter.com/2/oauth2/token?${qs}`, {
    method: 'POST',
    headers,
  });
}

export async function fetchTwitterUserData({
  accessToken,
}: {
  accessToken: string;
}) {
  return fetch('https://api.twitter.com/2/users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
