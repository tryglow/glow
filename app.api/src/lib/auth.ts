import {
  ExpressAuthConfig,
  getSession as getSessionExpress,
} from '@auth/express';
import { FastifyRequest } from 'fastify';

export const authConfig: ExpressAuthConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [],
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? `__Secure-next-auth.session-token`
          : `next-auth.session-token`,
    },
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (!session.user) return session;

      session.currentTeamId = token.teamId as string;
      session.user.id = token.sub as string;

      return session;
    },
  },
};

export const getSession = async (req: FastifyRequest) => {
  return await getSessionExpress(req, authConfig);
};
