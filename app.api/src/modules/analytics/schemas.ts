import { FastifySchema } from 'fastify';

export const getPageAnalyticsSchema: FastifySchema = {
  response: {
    200: {
      properties: {
        totals: {
          type: 'object',
          properties: {
            total_views: { type: 'number' },
            unique_visitors: { type: 'number' },
          },
        },
        data: {
          type: 'array',
          items: {
            date: { type: 'string' },
            total_views: { type: 'number' },
            unique_visitors: { type: 'number' },
          },
        },
      },
    },
    400: {
      type: 'object',
      properties: {
        error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
          },
        },
      },
      additionalProperties: false,
    },
  },
};
