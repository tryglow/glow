import { stripeClient } from '@better-auth/stripe/client';
import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseUrl: 'http://localhost:3001',
  plugins: [
    organizationClient(),
    stripeClient({
      subscription: true,
    }),
  ],
});

export default authClient;
