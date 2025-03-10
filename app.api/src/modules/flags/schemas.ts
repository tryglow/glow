export const getFlagsForCurrentUserSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        flags: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: { type: 'string' },
              value: { type: 'boolean' },
            },
          },
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

export const hideOnboardingTourSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
      additionalProperties: false,
    },
  },
};
