import 'server-only';

import { createLoopsClient, transactionalEmailIds } from '@/lib/loops';
import { captureException } from '@sentry/nextjs';

export async function sendSubscriptionCreatedEmail(
  email: string,
  planType: 'premium' | 'team'
) {
  const loops = createLoopsClient();

  if (!loops) {
    return;
  }

  const transactionalId =
    planType === 'premium'
      ? transactionalEmailIds.subscriptionCreatedPremium
      : transactionalEmailIds.subscriptionCreatedTeam;

  try {
    await loops.sendTransactionalEmail({
      transactionalId,
      email,
    });
  } catch (error) {
    captureException(error);
  }
}
