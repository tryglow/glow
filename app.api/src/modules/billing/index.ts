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
  fastify.post('/callback', postStripeCallbackHandler);
}

const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY as string);

async function postStripeCallbackHandler(
  request: FastifyRequest,
  response: FastifyReply
) {
  const body = (await request.body) as string;

  const headers = request.headers;

  const signature = headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    captureException(error);
    return response.status(400).send({ error: 'Invalid signature' });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await setupSubscription(event.data.object.id);
      break;
    case 'customer.subscription.deleted':
      await cancelSubscription(event.data.object.id);
      break;
  }

  return response.status(200).send({ received: true });
}
