import { FastifySchema } from 'fastify';

export const generateScreenshotSchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      url: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        url: { type: 'string' },
      },
    },
  },
};
