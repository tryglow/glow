import { createLoopsClient, transactionalEmailIds } from '@/lib/loops';
import { captureException } from '@sentry/nextjs';

export async function sendSubscriptionCancelledEmail(email: string) {
  const loops = createLoopsClient();

  try {
    await loops.sendTransactionalEmail({
      transactionalId: transactionalEmailIds.subscriptionCancelled,
      email,
    });
  } catch (error) {
    captureException(error);
  }
}
