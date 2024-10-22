'use client';
import { fetcher } from '@/lib/fetch';
import { defaultThemeSeeds, themeColorToCssValue } from '@/lib/theme';
import { Theme } from '@prisma/client';
import useSWR from 'swr';

export function RenderPageTheme({ pageSlug }: { pageSlug: string }) {
  const { data: pageTheme } = useSWR<{ theme: Partial<Theme> }>(
    `/api/pages/${pageSlug}/theme`,
    fetcher
  );

  let theme = pageTheme?.theme || defaultThemeSeeds.Default;

  if (!pageTheme) return null;

  return (
    <style>
      {`:root {
          --color-sys-bg-base: ${themeColorToCssValue(theme.colorBgBase)};
          --color-sys-bg-primary: ${themeColorToCssValue(theme.colorBgPrimary)};
          --color-sys-bg-secondary: ${themeColorToCssValue(theme.colorBgSecondary)};
          --color-sys-bg-border: ${themeColorToCssValue(theme.colorBorderPrimary)};
          
          --color-sys-label-primary: ${themeColorToCssValue(theme.colorLabelPrimary)};
          --color-sys-label-secondary: ${themeColorToCssValue(theme.colorLabelSecondary)};
          }`}
    </style>
  );
}
