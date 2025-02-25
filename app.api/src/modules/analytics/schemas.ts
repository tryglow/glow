import { FastifySchema } from 'fastify';

export const getPageAnalyticsSchema: FastifySchema = {
  response: {
    200: {
      properties: {
        stats: {
          type: 'object',
          properties: {
            totals: {
              type: 'object',
              properties: {
                views: { type: 'number' },
                uniqueVisitors: { type: 'number' },
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
        locations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              location: { type: 'string' },
              visits: { type: 'number' },
              hits: { type: 'number' },
            },
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
