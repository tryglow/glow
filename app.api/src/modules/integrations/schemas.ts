export const getCurrentUserTeamIntegrationsSchema = {
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
        type: {
          type: 'string',
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
