export async function requestToken({ code }: { code: string }) {
  if (!process.env.INSTAGRAM_CLIENT_ID) {
    throw new Error('Missing INSTAGRAM_CLIENT_ID')
  }

  if (!process.env.INSTAGRAM_CLIENT_SECRET) {
    throw new Error('Missing INSTAGRAM_CLIENT_SECRET')
  }

  if (!process.env.INSTAGRAM_CALLBACK_URL) {
    throw new Error('Missing INSTAGRAM_CALLBACK_URL')
  }

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  const options = {
    client_id: process.env.INSTAGRAM_CLIENT_ID,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: process.env.INSTAGRAM_CALLBACK_URL,
    code,
  }

  return fetch(`https://api.instagram.com/oauth/access_token`, {
    method: 'POST',
    headers,
    body: new URLSearchParams(options),
  })
}
