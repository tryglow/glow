import { prices } from '@/lib/plans';
import { createNewSubscription } from '@/modules/billing/utils/create-new-subscription';
import { createNewOrganization } from '@/modules/organizations/utils';
import { sendSlackMessage } from '@/modules/slack/service';
import { captureMessage } from '@sentry/node';
import Stripe from 'stripe';

/**
 * Handle subscription created events
 */
export async function handleSubscriptionCreated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  console.log('Subscription Created', subscription);

  const lineItems = subscription.items.data;
  if (lineItems.length === 0) {
    captureMessage(
      `Subscription created but no line items found with Stripe Subscription ID: ${subscription.id}`
    );
    return;
  }

  const lineItem = lineItems[0];
  const priceId = lineItem.price.id;

  const env = (process.env.NODE_ENV ?? 'development') as
    | 'production'
    | 'development';

  const allPrices =
    env === 'development' ? prices.development : prices.production;

  console.log('All Prices', allPrices);

  // Determine the plan based on the price ID
  let plan: 'premium' | 'team' | 'freeLegacy' | null = null;

  for (const [key, value] of Object.entries(allPrices)) {
    if (value === priceId) {
      plan = key as 'premium' | 'team' | 'freeLegacy';
      break;
    }
  }

  console.log('New Plan', plan);

  // Handle team plan creation separately
  if (plan === 'team') {
    const createdByUserId = subscription.metadata?.createdByUserId;

    console.log('Created By User ID', createdByUserId);

    if (!createdByUserId) {
      captureMessage(
        `Team subscription created but no createdByUserId found in metadata for Stripe Subscription ID: ${subscription.id}`
      );

      return;
    }

    // Create new team organization
    const newTeamOrg = await createNewOrganization({
      ownerId: createdByUserId,
      type: 'team',
    });

    await createNewSubscription({
      plan: 'team',
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      referenceId: newTeamOrg.id,
      periodStart: new Date(subscription.current_period_start * 1000),
      periodEnd: new Date(subscription.current_period_end * 1000),
    });

    await sendSlackMessage({
      text: `Team subscription created for ${newTeamOrg.id} (Subscription: ${subscription.id})`,
    });

    return {
      success: true,
    };
  }

  if (plan === 'freeLegacy') {
    // Nothing to do here

    await sendSlackMessage({
      text: `Free legacy subscription created for ${subscription.id}`,
    });

    return {
      success: true,
    };
  }

  if (plan === 'premium') {
    // Nothing to do here

    await sendSlackMessage({
      text: `Premium subscription created for ${subscription.id}`,
    });

    return {
      success: true,
    };
  }
}
