export const tikTokOrchestratorSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        pageSlug: {
          type: 'string',
        },
      },
      additionalProperties: false,
    },
    400: {
      type: 'object',
      properties: {
        error: {
          type: 'string',
        },
      },
      additionalProperties: false,
    },
  },
};
