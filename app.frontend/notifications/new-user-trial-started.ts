import { createLoopsClient, transactionalEmailIds } from '@/lib/loops';
import { captureException } from '@sentry/nextjs';
import 'server-only';

export async function newUserTrialStarted(email: string) {
  const loops = createLoopsClient();

  if (!loops) {
    return;
  }

  try {
    await loops.sendTransactionalEmail({
      transactionalId: transactionalEmailIds.newUserTrialStarted,
      email,
    });
  } catch (error) {
    captureException(error);
  }
}
