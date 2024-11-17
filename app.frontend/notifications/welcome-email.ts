import 'server-only';

import { createLoopsClient } from '@/lib/loops';
import { captureException } from '@sentry/nextjs';

export async function sendWelcomeEmail(email: string) {
  const loops = createLoopsClient();

  if (!loops) {
    return;
  }

  try {
    await loops.sendEvent({
      email,
      eventName: 'accountCreated',
    });
  } catch (error) {
    captureException(error);
  }
}
