import prisma from '@/lib/prisma';
import { prices } from '@/lib/stripe-prices';
import { sendSubscriptionCancelledEmail } from '@/notifications/subscription-cancelled-email';
import { sendSubscriptionCreatedEmail } from '@/notifications/subscription-created-email';
import { captureException } from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY as string);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    captureException(error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await setupSubscription(event.data.object.id);
      break;
    case 'customer.subscription.deleted':
      await cancelSubscription(event.data.object.id);
      break;
  }

  return NextResponse.json({ received: true });
}

async function setupSubscription(sessionId: string) {
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

  const currentEnvPrices =
    prices[process.env.NODE_ENV as 'development' | 'production'];

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

async function cancelSubscription(subscriptionId: string) {
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
