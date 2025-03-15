import prisma from '@/lib/prisma';
import { sendSlackMessage } from '@/modules/slack/service';
import { captureMessage } from '@sentry/node';
import Stripe from 'stripe';

/**
 * Handle subscription deleted events
 */
export async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  const dbSubscription = await prisma.subscription.findFirst({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    select: {
      id: true,
      organization: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!dbSubscription) {
    captureMessage(
      `Subscription deleted but not found in database: ${subscription.id}`
    );
    return;
  }

  // For non-team subscriptions, simply update the status and plan
  await prisma.subscription.update({
    where: {
      id: dbSubscription.id,
    },
    data: {
      status: 'canceled',
      plan: 'freeLegacy',
      periodEnd: new Date(),
    },
  });

  await sendSlackMessage({
    text: `Subscription deleted for ${dbSubscription.organization?.id} (Subscription: ${dbSubscription.id})`,
  });

  return {
    success: true,
  };
}
