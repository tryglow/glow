'use strict';

import { getSession } from '../../lib/auth';
import { getPageLayoutSchema, getPageThemeSchema } from './schemas';
import {
  getPageIdBySlugOrDomain,
  getPageLayoutById,
  getPageThemeById,
} from './service';
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

  fastify.post('/get-page-id', getPageIdHandler);
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

  return response.status(200).send({
    xxs: page?.mobileConfig,
    sm: page?.config,
  });
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

async function getPageIdHandler(
  request: FastifyRequest<{ Body: { slug: string; domain: string } }>,
  response: FastifyReply
) {
  const { slug, domain } = request.body;

  if (!slug && !domain) {
    return response.status(400).send({
      error: {
        message: 'Slug or domain is required',
      },
    });
  }

  const pageId = await getPageIdBySlugOrDomain(slug, domain);

  return response.status(200).send({ pageId });
}
