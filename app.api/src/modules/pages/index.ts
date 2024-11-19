'use strict';

import { getSession } from '../../lib/auth';
import {
  getCurrentUserTeamPagesSchema,
  getPageBlocksSchema,
  getPageLayoutSchema,
  getPageSettingsSchema,
  getPageThemeSchema,
} from './schemas';
import {
  getPageBlocks,
  getPageIdBySlugOrDomain,
  getPageLayoutById,
  getPageSettings,
  getPagesForTeamId,
  getPageThemeById,
} from './service';
import { FastifyInstance, FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';

export default async function pagesRoutes(fastify: FastifyInstance, opts: any) {
  fastify.get(
    '/me',
    { schema: getCurrentUserTeamPagesSchema },
    getCurrentUserTeamPagesHandler
  );

  fastify.get(
    '/:pageId/layout',
    { schema: getPageLayoutSchema },
    getPageLayoutHandler
  );

  fastify.get(
    '/:pageId/settings',
    { schema: getPageSettingsSchema },
    getPageSettingsHandler
  );

  fastify.get(
    '/:pageId/theme',
    { schema: getPageThemeSchema },
    getPageThemeHandler
  );

  fastify.get(
    '/:pageId/blocks',
    { schema: getPageBlocksSchema },
    getPageBlocksHandler
  );

  fastify.post('/get-page-id', getPageIdHandler);
}

async function getPageLayoutHandler(
  request: FastifyRequest<{ Params: { pageId: string } }>,
  response: FastifyReply
) {
  const { pageId } = request.params;

  const session = await request.server.authenticate(request, response, {
    throwError: false,
  });

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

  const session = await request.server.authenticate(request, response, {
    throwError: false,
  });

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

async function getPageBlocksHandler(
  request: FastifyRequest<{ Params: { pageId: string } }>,
  response: FastifyReply
) {
  const session = await request.server.authenticate(request, response, {
    throwError: false,
  });

  const { pageId } = request.params;

  if (!pageId) {
    return response.status(400).send({});
  }

  const page = await getPageBlocks(pageId);

  if (!page) {
    return response.status(404).send({});
  }

  let currentUserIsOwner = false;

  if (session?.user.id && page?.teamId === session?.currentTeamId) {
    currentUserIsOwner = true;
  }

  if (page.publishedAt == null && !currentUserIsOwner) {
    return response.status(404).send({});
  }

  return response.status(200).send({
    blocks: page.blocks,
    currentUserIsOwner,
  });
}

async function getCurrentUserTeamPagesHandler(
  request: FastifyRequest,
  response: FastifyReply
) {
  const session = await request.server.authenticate(request, response);

  const pages = await getPagesForTeamId(session.currentTeamId);

  return response.status(200).send(pages);
}

export async function getPageSettingsHandler(
  request: FastifyRequest<{ Params: { pageId: string } }>,
  response: FastifyReply
) {
  const session = await request.server.authenticate(request, response);

  const { pageId } = request.params;

  const page = await getPageSettings(pageId);

  if (!page) {
    return response.status(404).send({});
  }

  let currentUserIsOwner = false;

  if (session?.user.id && page?.teamId === session?.currentTeamId) {
    currentUserIsOwner = true;
  }

  if (page.publishedAt == null && !currentUserIsOwner) {
    return response.status(404).send({});
  }

  return response.status(200).send(page);
}
