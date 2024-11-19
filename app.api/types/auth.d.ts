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
  interface FastifyRequest {
    startTime?: number;
  }
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
      options?: {
        throwError?: boolean;
      }
    ) => Promise<{ user: { id: string } } | HttpError>;
  }
}
