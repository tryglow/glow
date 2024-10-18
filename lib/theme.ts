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
    colorBgPrimary: '0 0% 100%',
    colorBgSecondary: '0 0% 90.20%',
    colorLabelPrimary: '240deg 3.45% 11.37%',
    colorLabelSecondary: '0 0% 16%',
    colorBorderPrimary: '0deg 0% 91.76%',
    colorLabelTertiary: '0 0% 98.04%',
    colorBgBase: '60deg 4.76% 96%',
  },
  Purple: {
    id: '14fc9bdf-f363-4404-b05e-856670722fda',
    colorBgPrimary: '255deg 29% 13.5%',
    colorBgSecondary: '0 0% 0%',
    colorLabelPrimary: '0 0% 100%',
    colorLabelSecondary: '293.33 7.44% 76.27%',
    colorBorderPrimary: '253.55deg 19.69% 28.37%',
    colorLabelTertiary: '0 0% 98.04%',
    colorBgBase: '255.48 30.10% 20.20%',
  },
  Black: {
    id: '1e24ab02-9b97-4a61-9b83-fe278a41b30b',
    colorBgPrimary: '0 0% 0%',
    colorBgSecondary: '0 0% 90.20%',
    colorLabelPrimary: '0 0% 100%',
    colorLabelSecondary: '0 0% 98.04%',
    colorBorderPrimary: '0 0% 16.07%',
    colorLabelTertiary: '0 0% 98.04%',
    colorBgBase: '0 0% 0%',
  },
  Forest: {
    id: '4c47b21f-9183-4e7a-be6c-6ee4fabae92a',
    colorBgPrimary: '140deg 9.88% 31%',
    colorBgSecondary: '0 0% 90.20%',
    colorLabelPrimary: '0 0% 100%',
    colorLabelSecondary: '141.18deg 41.46% 83.92%',
    colorBorderPrimary: '140deg 9.88% 31%',
    colorLabelTertiary: '0 0% 98.04%',
    colorBgBase: '141.18deg 8.13% 41%',
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
  return `${colorAsHsl.h} ${colorAsHsl.s}% ${colorAsHsl.l}%`;
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
