export const getCurrentUserTeamsSchema = {
  response: {
    200: {
      type: 'array',
      properties: {
        id: {
          type: 'string',
        },
        createdAt: {
          type: 'string',
        },
        updatedAt: {
          type: 'string',
        },
        isPersonal: {
          type: 'boolean',
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
