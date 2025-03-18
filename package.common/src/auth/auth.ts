import {
  magicLinkClient,
  organizationClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const auth = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [organizationClient(), magicLinkClient()],
});

console.log('Auth Client', process.env.NEXT_PUBLIC_API_URL);
