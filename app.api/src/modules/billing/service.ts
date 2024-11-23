import prisma from '@/lib/prisma';
import { prices } from '@/modules/billing/constants';
import {
  sendSubscriptionCancelledEmail,
  sendSubscriptionCreatedEmail,
} from '@/modules/notifications/service';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY as string);

export async function setupSubscription(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session.subscription) {
    throw new Error('No subscription found');
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  if (subscription.status !== 'active') {
    throw new Error('Subscription is not active');
  }

  const planItem = subscription?.items.data[0];

  const dbUser = await prisma.user.findFirst({
    where: {
      stripeCustomerId: subscription.customer.toString(),
    },
  });

  if (!dbUser) {
    throw new Error('User not found');
  }

  const currentEnv =
    process.env.APP_ENV === 'production' ? 'production' : 'development';

  const currentEnvPrices = prices[currentEnv];

  const hasTeamAccess = currentEnvPrices.team === planItem.price.id;
  const hasPremiumAccess = currentEnvPrices.premium === planItem.price.id;

  if (!hasTeamAccess && !hasPremiumAccess) {
    throw new Error('User does not have access to any plan');
  }

  await prisma.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      hasPremiumAccess,
      hasTeamAccess,
    },
  });

  if (dbUser.email) {
    await sendSubscriptionCreatedEmail(
      dbUser.email,
      hasTeamAccess ? 'team' : 'premium'
    );
  }

  if (hasTeamAccess) {
    await prisma.team.create({
      data: {
        name: 'Shared Team',
        isPersonal: false,
        members: {
          create: {
            userId: dbUser.id,
          },
        },
      },
    });
  }

  return;
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  if (subscription.status !== 'active') {
    throw new Error('Subscription is not active');
  }

  const dbUser = await prisma.user.findFirst({
    where: {
      stripeCustomerId: subscription.customer.toString(),
    },
  });

  if (!dbUser) {
    throw new Error('User not found');
  }

  await prisma.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      hasPremiumAccess: false,
      hasTeamAccess: false,
    },
  });

  if (dbUser.email) {
    await sendSubscriptionCancelledEmail(dbUser.email);
  }

  return;
}
