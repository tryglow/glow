export const getCurrentUserPlanSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        plan: { type: 'string' },
        status: { type: 'string' },
        daysRemainingOnTrial: { type: 'number', nullable: true },
      },
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};
