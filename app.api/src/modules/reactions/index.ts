'use strict';

import prisma from '@/lib/prisma';
import {
  getIpAddress,
  getReactionsForPageId,
  reactToResource,
} from '@/modules/reactions/service';
import { FastifyInstance, FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';

export default async function reactionsRoutes(
  fastify: FastifyInstance,
  opts: any
) {
  fastify.get('/', getReactionsHandler);
  fastify.post('/', postReactionsHandler);
}

async function getReactionsHandler(
  request: FastifyRequest<{ Querystring: { pageId: string } }>,
  response: FastifyReply
) {
  const { pageId } = request.query;

  const page = await prisma.page.findUnique({
    where: {
      id: pageId,
    },
  });

  if (!page) {
    return response.status(404).send({
      error: {
        message: 'Page not found',
      },
    });
  }

  const ipAddress = await getIpAddress(request);

  const reactions = await getReactionsForPageId({ pageId, ipAddress });

  return response.status(200).send(reactions);
}

async function postReactionsHandler(
  request: FastifyRequest<{ Body: { pageId: string; increment: number } }>,
  response: FastifyReply
) {
  const { pageId, increment } = request.body;

  const ipAddress = await getIpAddress(request);

  const reactions = await reactToResource(pageId, increment, ipAddress);

  return response.status(200).send(reactions);
}
