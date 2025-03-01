'use client';

import { internalApiFetcher } from '@/lib/fetch';
import { getFontFamilyValue, getGoogleFontUrl } from '@/lib/fonts';
import { defaultThemeSeeds, themeColorToCssValue } from '@/lib/theme';
import { Theme } from '@tryglow/prisma';
import { useEffect } from 'react';
import useSWR from 'swr';

export function RenderPageTheme({ pageId }: { pageId: string }) {
  const { data: pageTheme } = useSWR<{ theme: Partial<Theme> }>(
    `/pages/${pageId}/theme`,
    internalApiFetcher
  );

  let theme = pageTheme?.theme || defaultThemeSeeds.Default;

  // Load the font if specified
  useEffect(() => {
    if (theme.font) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = getGoogleFontUrl(theme.font);
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [theme.font]);

  if (!pageTheme) return null;

  const fontFamily = theme.font ? getFontFamilyValue(theme.font) : null;

  return (
    <style>
      {`:root {
          --color-sys-bg-base: ${themeColorToCssValue(theme.colorBgBase)};
          --color-sys-bg-primary: ${themeColorToCssValue(theme.colorBgPrimary)};
          --color-sys-bg-secondary: ${themeColorToCssValue(theme.colorBgSecondary)};
          --color-sys-bg-border: ${themeColorToCssValue(theme.colorBorderPrimary)};
          
          --color-sys-label-primary: ${themeColorToCssValue(theme.colorLabelPrimary)};
          --color-sys-label-secondary: ${themeColorToCssValue(theme.colorLabelSecondary)};
          --font-sys-body: ${fontFamily || 'initial'};
          }`}
    </style>
  );
}
