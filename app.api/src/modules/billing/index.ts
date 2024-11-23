'use strict';

import { cancelSubscription, setupSubscription } from './service';
import { captureException } from '@sentry/node';
import { FastifyInstance, FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import Stripe from 'stripe';

export default async function billingRoutes(
  fastify: FastifyInstance,
  opts: any
) {
  fastify.post(
    '/stripe/callback',
    { config: { rawBody: true } },
    postStripeCallbackHandler
  );
}

const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY as string);

async function postStripeCallbackHandler(
  request: FastifyRequest<{ Body: { rawBody: string }; RawBody: string }>,
  response: FastifyReply
) {
  const signature = request.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody as string,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    captureException(error);
    return response.status(400).send({ error: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await setupSubscription(event.data.object.id);
        break;
      case 'customer.subscription.deleted':
        await cancelSubscription(event.data.object.id);
        break;
    }
  } catch (error) {
    captureException(error);
    return response.status(400).send({ error: 'Failed to process webhook' });
  }

  return response.status(200).send({ received: true });
}
