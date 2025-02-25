import prisma from '@/lib/prisma';
import { prices } from '@/modules/billing/constants';
import {
  sendSubscriptionCancelledEmail,
  sendSubscriptionCreatedEmail,
} from '@/modules/notifications/service';
import { captureMessage } from '@sentry/node';
import { User } from '@tryglow/prisma';
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
      plan: hasTeamAccess ? 'team' : 'premium',
      hasPremiumAccess,
      hasTeamAccess,
      stripeTrialEnd: null,
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

export async function createStripeCustomer(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw Error('User not found');
  }

  if (user.stripeCustomerId) {
    captureMessage('User already has a stripe customer ID', {
      level: 'info',
      extra: {
        stripeCustomerId: user.stripeCustomerId,
      },
    });

    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    name: user.name ?? '',
    email: user.email ?? '',
    metadata: {
      dbUserId: user.id,
    },
  });

  if (!customer) {
    throw Error('Error creating customer');
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      stripeCustomerId: customer.id,
    },
  });

  return customer.id;
}

export async function getOrCreateStripeCustomer(userId: string) {
  if (!userId) {
    throw Error('User not found');
  }

  return await createStripeCustomer(userId);
}

export const getBillingPortalLink = async (userId: string) => {
  const stripeCustomerId = await getOrCreateStripeCustomer(userId);

  const stripeSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
  });

  return stripeSession.url;
};

export async function getCheckoutLink({
  planType,
  user,
}: {
  planType: 'premium' | 'team';
  user: User;
}) {
  let stripeCustomerId = user?.stripeCustomerId;

  if (!user?.stripeCustomerId) {
    stripeCustomerId = await getOrCreateStripeCustomer(user.id);

    if (!stripeCustomerId) {
      throw Error('Unable to create Stripe Customer');
    }
  }

  const price =
    prices[process.env.NODE_ENV as 'development' | 'production'][planType];

  if (!price) {
    throw Error('Price ID not found');
  }

  if (!price) {
    throw Error('Price not found');
  }

  const successUrl =
    planType === 'team'
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/?showTeamOnboarding=true`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/?showPremiumOnboarding=true`;

  const stripeSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId as string,
    success_url: successUrl,
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    mode: 'subscription',
  });

  return stripeSession.url;
}
