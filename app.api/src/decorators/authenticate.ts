import fastify from '@/index';
import { getSession } from '@/lib/auth';
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
  reply: FastifyReply
): Promise<{ user: { id: string } } | HttpError> {
  const authJwt = request.headers.authorization;
  console.log('Node Env', process.env.NODE_ENV);

  if (authJwt && authJwt.startsWith('Bearer ')) {
    console.log('Auth JWT', authJwt);
    try {
      const decodedJwt = await decode<JWT>({
        token: authJwt.replace('Bearer ', ''),
        secret: process.env.AUTH_SECRET as string,
        salt:
          process.env.NODE_ENV === 'production'
            ? '__Secure-next-auth.session-token'
            : 'authjs.session-token',
      });

      if (decodedJwt?.sub) {
        return {
          user: {
            id: decodedJwt.sub,
          },
        };
      }
    } catch (error) {
      captureException(error);
      throw fastify.httpErrors.unauthorized();
    }
  }

  try {
    const session = await getSession(request);

    if (session?.user) {
      return {
        user: {
          id: session.user.id,
        },
      };
    }
  } catch (error) {
    captureException(error);
    throw fastify.httpErrors.unauthorized();
  }

  return fastify.httpErrors.unauthorized();
}
