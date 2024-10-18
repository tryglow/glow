import { JsonValue } from '@prisma/client/runtime/library';

export type DefaultThemeNames = 'Default' | 'Purple' | 'Black' | 'Forest';

export const defaultThemes: { id: string; name: DefaultThemeNames }[] = [
  {
    id: '00441c91-6762-44d8-8110-2b5616825bd9',
    name: 'Default',
  },
  {
    id: '14fc9bdf-f363-4404-b05e-856670722fda',
    name: 'Purple',
  },
  {
    id: '1e24ab02-9b97-4a61-9b83-fe278a41b30b',
    name: 'Black',
  },
  {
    id: '4c47b21f-9183-4e7a-be6c-6ee4fabae92a',
    name: 'Forest',
  },
];

export const defaultThemeSeeds: Record<DefaultThemeNames, any> = {
  Default: {
    id: '00441c91-6762-44d8-8110-2b5616825bd9',
    colorBgBase: { h: 0.06, l: 0.96, s: 0.0476 },
    colorBgPrimary: { h: 0, l: 0.01, s: 0 },
    colorBgSecondary: { h: 0, l: 0.902, s: 0 },
    colorBorderPrimary: { h: 0, l: 0.9176, s: 0 },
    colorLabelPrimary: { h: 0.024, l: 0.1137, s: 0.0345 },
    colorLabelSecondary: { h: 0, l: 0.16, s: 0 },
    colorLabelTertiary: { h: 0, l: 0.9804, s: 0 },
  },
  Purple: {
    id: '14fc9bdf-f363-4404-b05e-856670722fda',
    colorBgBase: { h: 255.48, l: 20.2, s: 30.1 },
    colorBgPrimary: { h: 255, l: 13.5, s: 29 },
    colorBgSecondary: { h: 0, l: 0, s: 0 },
    colorBorderPrimary: { h: 253.55, l: 28.37, s: 19.69 },
    colorLabelPrimary: { h: 0, l: 100, s: 0 },
    colorLabelSecondary: { h: 293.33, l: 76.27, s: 7.44 },
    colorLabelTertiary: { h: 0, l: 98.04, s: 0 },
  },
  Black: {
    id: '1e24ab02-9b97-4a61-9b83-fe278a41b30b',
    colorBgBase: { h: 0, l: 0, s: 0 },
    colorBgPrimary: { h: 0, l: 0, s: 0 },
    colorBgSecondary: { h: 0, l: 90.2, s: 0 },
    colorBorderPrimary: { h: 0, l: 16.07, s: 0 },
    colorLabelPrimary: { h: 0, l: 100, s: 0 },
    colorLabelSecondary: { h: 0, l: 98.04, s: 0 },
    colorLabelTertiary: { h: 0, l: 98.04, s: 0 },
  },
  Forest: {
    id: '4c47b21f-9183-4e7a-be6c-6ee4fabae92a',
    colorBgBase: { h: 141.18, l: 41, s: 8.13 },
    colorBgPrimary: { h: 140, l: 31, s: 9.88 },
    colorBgSecondary: { h: 0, l: 90.2, s: 0 },
    colorBorderPrimary: { h: 140, l: 31, s: 9.88 },
    colorLabelPrimary: { h: 0, l: 100, s: 0 },
    colorLabelSecondary: { h: 141.18, l: 83.92, s: 41.46 },
    colorLabelTertiary: { h: 0, l: 98.04, s: 0 },
  },
};

export const themeFields = [
  {
    id: 'colorBgBase',
    variable: 'color-sys-bg-base',
    label: 'Page background',
  },
  {
    id: 'colorBgPrimary',
    variable: 'color-sys-bg-primary',
    label: 'Primary background',
  },
  {
    id: 'colorBgSecondary',
    variable: 'color-sys-bg-secondary',
    label: 'Secondary background',
  },
  {
    id: 'colorLabelPrimary',
    variable: 'color-sys-label-primary',
    label: 'Primary text',
  },
  {
    id: 'colorLabelSecondary',
    variable: 'color-sys-label-secondary',
    label: 'Secondary text',
  },
  {
    id: 'colorLabelTertiary',
    variable: 'color-sys-label-tertiary',
    label: 'Tertiary text',
  },
  {
    id: 'colorBorderPrimary',
    variable: 'color-sys-border-primary',
    label: 'Primary border',
  },
];

export type HSLColor = {
  h: number;
  s: number;
  l: number;
};

export const themeColorToCssValue = (color?: JsonValue): string => {
  if (!color) return '';
  const colorAsHsl = color as HSLColor;
  return `${colorAsHsl.h} ${colorAsHsl.s * 100}% ${colorAsHsl.l * 100}%`;
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
