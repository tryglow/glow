import { z } from 'zod';

export const designPageSettingsSchema = z.object({
  themeId: z.string({
    required_error: 'Please select a theme',
  }),
  backgroundImage: z.string().optional(),
});

export const generalPageSettingsSchema = z.object({
  pageSlug: z.string({ required_error: 'Please provide a page slug' }),
  metaTitle: z.string({ required_error: 'Please provide a page title' }),
  published: z.boolean(),
});
