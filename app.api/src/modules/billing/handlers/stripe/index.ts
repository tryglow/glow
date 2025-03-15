import { stripeClient } from '@/lib/stripe';
import { handleSubscriptionCancelled } from '@/modules/billing/handlers/stripe/handle-subscription-cancelled';
import { handleSubscriptionCreated } from '@/modules/billing/handlers/stripe/handle-subscription-created';
import { handleSubscriptionDeleted } from '@/modules/billing/handlers/stripe/handle-subscription-deleted';
import { handleTrialWillEnd } from '@/modules/billing/handlers/stripe/handle-trial-will-end';
import { captureException } from '@sentry/node';
import { FastifyRequest, FastifyReply } from 'fastify';
import Stripe from 'stripe';

export async function stripeWebhookHandler(
  request: FastifyRequest<{ Body: { rawBody: string }; RawBody: string }>,
  response: FastifyReply
) {
  const signature = request.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(
      request.rawBody as string,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.log('Error', error);
    captureException(error);
    return response.status(400).send({ error: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event);
        break;
      case 'customer.subscription.updated':
        // Handle subscription updates (e.g., plan changes, trial ending)
        if (event.data.object.cancel_at_period_end) {
          await handleSubscriptionCancelled(event);
        }
        break;
      case 'customer.subscription.trial_will_end':
        // This event occurs 3 days before a trial ends
        await handleTrialWillEnd(event);
        break;
    }
  } catch (error) {
    captureException(error);
    return response.status(400).send({ error: 'Failed to process webhook' });
  }

  return response.status(200).send({ received: true });
}
