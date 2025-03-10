import { stripeClient } from '@better-auth/stripe/client';
import {
  magicLinkClient,
  organizationClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [
    organizationClient(),
    stripeClient({
      subscription: true,
    }),
    magicLinkClient(),
  ],
});

export const { signIn, signOut, useSession, getSession } = authClient;
