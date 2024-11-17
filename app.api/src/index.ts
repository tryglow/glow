
import cors from '@fastify/cors';
import fastifySensible, { HttpError } from '@fastify/sensible';

import * as Sentry from '@sentry/node';
import 'dotenv/config';
import Fastify, {
  FastifyInstance,

} from 'fastify';

import prisma from './lib/prisma';
import { coreRoutes } from './modules/core';
import './lib/sentry';

const fastify: FastifyInstance = Fastify();

await fastify.register(fastifySensible);

await fastify.register(cors, {
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  exposedHeaders: ['Content-Length'], // Expose specific headers
  credentials: true,
  maxAge: 86400, // Cache preflight response for 24 hours
});

Sentry.setupFastifyErrorHandler(fastify);

(async () => {
  fastify.register(coreRoutes);

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

  void prisma
    .$connect()
    .then(async () => {
      fastify.listen({ port, host: '0.0.0.0' });
    })
    .then(() => {
      console.info(`App listening on ${port}`);
    });
})();

export default fastify;