import { getSession } from '../lib/auth';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function coreRoutes(fastify: FastifyInstance) {
  fastify.get('/', {
    handler: async (req: FastifyRequest, res: FastifyReply) => {
      return res.status(200).send({
        message: 'Welcome to the Glow API',
      });
    },
  });

  fastify.get('/ping', {
    handler: async (req: FastifyRequest, res: FastifyReply) => {
      return res.status(200).send({
        ping: 'pong',
      });
    },
  });

  fastify.get('/session/me', {
    handler: async (req: FastifyRequest, res: FastifyReply) => {
      const session = await getSession(req);

      return res.status(200).send({
        session,
      });
    },
  });
}