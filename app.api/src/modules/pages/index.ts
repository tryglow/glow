'use strict';

import { getSession } from '../../lib/auth';
import { getPageLayoutSchema, getPageThemeSchema } from './schemas';
import { getPageLayoutById, getPageThemeById } from './service';
import { FastifyInstance, FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';

export default async function pagesRoutes(fastify: FastifyInstance, opts: any) {
  fastify.get(
    '/:pageId/layout',
    { schema: getPageLayoutSchema },
    getPageLayoutHandler
  );

  fastify.get(
    '/:pageId/theme',
    { schema: getPageThemeSchema },
    getPageThemeHandler
  );
}

async function getPageLayoutHandler(
  request: FastifyRequest<{ Params: { pageId: string } }>,
  response: FastifyReply
) {
  const { pageId } = request.params;

  const session = await getSession(request);

  const page = await getPageLayoutById(pageId);

  if (!page?.publishedAt) {
    if (session?.currentTeamId !== page?.teamId) {
      return response.status(404).send({});
    }
  }

  return response.status(200).send(page);
}

async function getPageThemeHandler(
  request: FastifyRequest<{ Params: { pageId: string } }>,
  response: FastifyReply
) {
  const { pageId } = request.params;

  const session = await getSession(request);

  const page = await getPageThemeById(pageId);

  if (!page?.publishedAt) {
    if (session?.currentTeamId !== page?.teamId) {
      return response.status(404).send({});
    }
  }

  return response.status(200).send(page);
}
