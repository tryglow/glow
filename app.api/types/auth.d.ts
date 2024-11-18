import '@auth/express';
import fastify from 'fastify';

declare module '@auth/express' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
    };
    currentTeamId: string;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<{ user: { id: string } } | HttpError>;
  }
}
