import { OAuth2Config, Provider } from '@auth/core/providers';
import { customFetch } from 'next-auth';

export const CustomTiktok: OAuth2Config<any> & Provider = {
  async [customFetch](...args) {
    const url = new URL(args[0] instanceof Request ? args[0].url : args[0]);
    if (url.pathname.endsWith('/token/')) {
      const [url, request] = args;

      const customHeaders = {
        ...request?.headers,
        'content-type': 'application/x-www-form-urlencoded',
      };

      const customBody = new URLSearchParams(request?.body as string);
      customBody.append('client_key', process.env.AUTH_TIKTOK_ID!);
      const response = await fetch(url, {
        ...request,
        headers: customHeaders,
        body: customBody.toString(),
      });
      const json = await response.json();

      return Response.json({ ...json });
    }
    return fetch(...args);
  },
  id: 'tiktok',
  name: 'TikTok',
  type: 'oauth',
  client: {
    token_endpoint_auth_method: 'client_secret_post',
  },
  authorization: {
    url: 'https://www.tiktok.com/v2/auth/authorize',
    params: {
      client_key: process.env.AUTH_TIKTOK_ID,
      scope: 'user.info.profile',
    },
  },

  token: 'https://open.tiktokapis.com/v2/oauth/token/',
  userinfo:
    'https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name,username',

  profile(profile) {
    return {
      id: profile.data.user.open_id,
      name: profile.data.user.display_name,
      image: profile.data.user.avatar_url,
      email: profile.data.user.email || profile.data.user.username || null,
    };
  },
};
