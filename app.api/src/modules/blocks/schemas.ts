export const getBlockSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        blockData: {
          id: { type: 'string' },
          name: { type: 'string' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
        },
        integration: {
          id: { type: 'string' },
          integrationType: { type: 'string' },
          createdAt: { type: 'string' },
        },
      },
      additionalProperties: false,
    },
    404: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
};

export const getEnabledBlockSchema = {
  response: {
    200: { type: 'array', items: { type: 'string' } },
    404: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
};
