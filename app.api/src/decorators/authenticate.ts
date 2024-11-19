import fastify from '@/index';
import { cookieName, getSession } from '@/lib/auth';
import { decode } from '@auth/core/jwt';
import { HttpError } from '@fastify/sensible';
import { captureException } from '@sentry/node';
import { FastifyReply, FastifyRequest } from 'fastify';

interface JWT {
  name: string;
  email: string;
  picture: string;
  sub: string;
  uid: string;
  iat: number;
  exp: number;
  jti: string;
  teamId: string;
}

export async function authenticateDecorator(
  request: FastifyRequest,
  reply: FastifyReply,
  options: {
    throwError?: boolean;
  } = {
    throwError: true,
  }
): Promise<{ user: { id: string }; currentTeamId: string } | HttpError | null> {
  const authJwt = request.headers.authorization;

  if (authJwt && authJwt.startsWith('Bearer ')) {
    try {
      const decodedJwt = await decode<JWT>({
        token: authJwt.replace('Bearer ', ''),
        secret: process.env.AUTH_SECRET as string,
        salt: cookieName,
      });

      if (decodedJwt?.sub) {
        return {
          user: {
            id: decodedJwt.sub,
          },
          currentTeamId: decodedJwt.teamId,
        };
      }
    } catch (error) {
      captureException(error);
      if (options.throwError) {
        throw fastify.httpErrors.unauthorized();
      } else {
        return null;
      }
    }
  }

  try {
    const session = await getSession(request);

    if (session?.user) {
      return {
        user: {
          id: session.user.id,
        },
        currentTeamId: session.currentTeamId,
      };
    }
  } catch (error) {
    captureException(error);
    if (options.throwError) {
      throw fastify.httpErrors.unauthorized();
    } else {
      return null;
    }
  }

  if (options.throwError) {
    throw fastify.httpErrors.unauthorized();
  } else {
    return null;
  }
}
