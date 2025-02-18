'use server';

import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';
import { prices } from '@/lib/stripe-prices';
import { newUserTrialStarted } from '@/notifications/new-user-trial-started';
import { captureMessage } from '@sentry/nextjs';
import stripe from 'stripe';

const Stripe = new stripe(process.env.STRIPE_API_SECRET_KEY as string);

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

  const customer = await Stripe.customers.create({
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

export async function getOrCreateStripeCustomer() {
  const session = await auth();

  if (!session || !session.user.id) {
    throw Error('User not found');
  }

  return await createStripeCustomer(session.user.id);
}

export const getBillingPortalLink = async () => {
  const stripeCustomerId = await getOrCreateStripeCustomer();

  const stripeSession = await Stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
  });

  return stripeSession.url;
};

export const getCheckoutLink = async ({
  planType,
}: {
  planType: 'premium' | 'team';
}) => {
  const session = await auth();

  if (!session || !session.user.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  let stripeCustomerId = user?.stripeCustomerId;

  if (!user?.stripeCustomerId) {
    stripeCustomerId = await getOrCreateStripeCustomer();

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

  const stripeSession = await Stripe.checkout.sessions.create({
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
};

export async function createTrialSubscription(userId: string) {
  const stripeCustomerId = await createStripeCustomer(userId);

  const price =
    prices[process.env.NODE_ENV as 'development' | 'production']['premium'];

  if (!price) {
    throw Error('Price ID not found');
  }

  const subscription = await Stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [{ price }],
    trial_period_days: 14,
    metadata: {
      dbUserId: userId,
    },
  });

  const dateNow = new Date();
  const fourteenDaysFromNow = new Date(
    dateNow.getTime() + 14 * 24 * 60 * 60 * 1000
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      hasPremiumAccess: true,
      stripeSubscriptionId: subscription.id,
      plan: 'premium',
      stripeTrialEnd: fourteenDaysFromNow,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user?.email) {
    await newUserTrialStarted(user.email);
  }

  return subscription;
}
