'use server';

import { authClient } from './auth';
import { captureException } from '@sentry/nextjs';

export async function signOut() {
  await authClient.signOut();
}

export async function hideGlowTour() {
  try {
    const req = await authClient.updateUser({
      metadata: {
        showTour: false,
        hello: 'world,',
      },
    });

    console.log(req);
  } catch (error) {
    console.log('Error hiding glow tour', error);
    captureException(error);
  }
}
