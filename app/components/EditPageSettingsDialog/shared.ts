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

export type HSLColor = {
  h: number;
  s: number;
  l: number;
};

export type ThemeData = {
  themeName: string;
  colorBgBase: HSLColor;
  colorBgPrimary: HSLColor;
  colorBgSecondary: HSLColor;
  colorLabelPrimary: HSLColor;
  colorLabelSecondary: HSLColor;
  colorLabelTertiary: HSLColor;
  colorBorderPrimary: HSLColor;
};

export const hslToHex = ({ h, s, l }: HSLColor) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0'); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};
