export const getPageLayoutSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        config: {
          type: 'object',
        },
        mobileConfig: {
          type: 'object',
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

const themeFields = [
  'colorBgBase',
  'colorBgPrimary',
  'colorBgSecondary',
  'colorBorderPrimary',
  'colorLabelPrimary',
  'colorLabelSecondary',
  'colorLabelTertiary',
];

const themeFieldsSchema = {
  type: 'object',
  properties: themeFields.reduce((acc: Record<string, any>, field) => {
    acc[field] = {
      type: 'object',
      properties: {
        h: {
          type: 'number',
        },
        l: {
          type: 'number',
        },
        s: {
          type: 'number',
        },
      },
    };
    return acc;
  }, {}),
};

export const getPageThemeSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        theme: themeFieldsSchema,
        backgroundImage: {
          type: 'string',
        },
      },
      additionalProperties: false,
    },
  },
};
