import { authConfig } from './lib/auth';
import prisma from './lib/prisma';
import './lib/sentry';
import blocksRoutes from './modules/blocks';
import { coreRoutes } from './modules/core';
import pagesRoutes from './modules/pages';
import tiktokServiceRoutes from './modules/services/tiktok';
import { authenticateDecorator } from '@/decorators/authenticate';
import { ExpressAuth } from '@auth/express';
import cors from '@fastify/cors';
import fastifyExpress from '@fastify/express';
import fastifySensible from '@fastify/sensible';
import * as Sentry from '@sentry/node';
import 'dotenv/config';
import Fastify, { FastifyInstance } from 'fastify';

export const fastify: FastifyInstance = Fastify();

await fastify.register(fastifyExpress);
await fastify.register(fastifySensible);

await fastify.register(cors, {
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  exposedHeaders: ['Content-Length'], // Expose specific headers
  credentials: true,
  maxAge: 86400, // Cache preflight response for 24 hours
});

fastify.register(coreRoutes);
fastify.register(blocksRoutes, { prefix: '/blocks' });
fastify.register(pagesRoutes, { prefix: '/pages' });
fastify.register(tiktokServiceRoutes, { prefix: '/services/tiktok' });

fastify.use('/auth', ExpressAuth(authConfig));

fastify.decorate('authenticate', authenticateDecorator);

Sentry.setupFastifyErrorHandler(fastify);

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    void prisma
      .$connect()
      .then(async () => {
        await fastify.listen({ port, host: '0.0.0.0' });
      })
      .then(() => {
        console.info(`App listening on ${port}`);
      });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export default fastify;
