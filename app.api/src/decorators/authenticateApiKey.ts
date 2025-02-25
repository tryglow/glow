import fastify from '@/index';
import { HttpError } from '@fastify/sensible';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function authenticateApiKeyDecorator(
  request: FastifyRequest,
  reply: FastifyReply,
  options: {
    throwError?: boolean;
  } = {
    throwError: true,
  }
): Promise<boolean | HttpError> {
  const headers = request?.headers;
  const apiKey = Array.isArray(headers['x-api-key'])
    ? headers['x-api-key'][0]
    : headers['x-api-key'];

  if (apiKey !== process.env.INTERNAL_API_KEY) {
    if (options.throwError) {
      throw fastify.httpErrors.unauthorized('Invalid API key');
    }
    return false;
  }

  return true;
}
