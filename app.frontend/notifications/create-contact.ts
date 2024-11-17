import 'server-only';

import { createLoopsClient } from '@/lib/loops';
import { captureException } from '@sentry/nextjs';

export async function createContact(email: string) {
  const loops = createLoopsClient();

  if (!loops) {
    return;
  }

  try {
    await loops.createContact(email);
  } catch (error) {
    captureException(error);
  }
}
