'use server';

import { ThemeData } from '@/app/components/EditPageSettingsDialog/shared';
import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';
import { captureException } from '@sentry/nextjs';

export async function createTheme({
  themeName,
  colorBgBase,
  colorBgPrimary,
  colorBgSecondary,
  colorTitlePrimary,
  colorTitleSecondary,
  colorLabelPrimary,
  colorLabelSecondary,
  colorLabelTertiary,
  colorBorderPrimary,
  font,
  backgroundImage,
}: ThemeData) {
  const session = await auth();

  if (!session || !session.currentTeamId) {
    return {
      error: 'Unauthorized',
    };
  }

  if (!themeName) {
    return {
      error: 'Theme name is required',
    };
  }

  try {
    const newTheme = await prisma.theme.create({
      data: {
        name: themeName,
        isDefault: false,
        createdById: session.user.id,
        teamId: session.currentTeamId,
        colorBgBase,
        colorBgPrimary,
        colorBgSecondary,
        colorTitlePrimary,
        colorTitleSecondary,
        colorLabelPrimary,
        colorLabelSecondary,
        colorLabelTertiary,
        colorBorderPrimary,
        font,
        backgroundImage,
      },
    });

    return {
      success: true,
      data: {
        id: newTheme.id,
      },
    };
  } catch (error) {
    captureException(error);
    return {
      error: 'Failed to create theme',
    };
  }
}

export async function updateTheme(themeId: string, data: ThemeData) {
  const session = await auth();

  if (!session || !session.currentTeamId) {
    return {
      error: 'Unauthorized',
    };
  }

  const theme = await prisma.theme.findFirst({
    where: {
      teamId: session.currentTeamId,
      id: themeId,
      isDefault: false,
    },
  });

  if (!theme) {
    return {
      error: 'Theme not found',
    };
  }

  try {
    await prisma.theme.update({
      where: {
        id: themeId,
      },
      data: {
        name: data.themeName,
        colorBgBase: data.colorBgBase,
        colorBgPrimary: data.colorBgPrimary,
        colorBgSecondary: data.colorBgSecondary,
        colorTitlePrimary: data.colorTitlePrimary,
        colorTitleSecondary: data.colorTitleSecondary,
        colorLabelPrimary: data.colorLabelPrimary,
        colorLabelSecondary: data.colorLabelSecondary,
        colorLabelTertiary: data.colorLabelTertiary,
        colorBorderPrimary: data.colorBorderPrimary,
        font: data.font,
        backgroundImage: data.backgroundImage,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    captureException(error);
    return {
      error: 'Failed to update theme',
    };
  }
}

export async function fetchTheme(themeId: string) {
  const session = await auth();

  if (!session || !session.currentTeamId) {
    return {
      error: 'Unauthorized',
    };
  }

  const theme = await prisma.theme.findFirst({
    where: {
      id: themeId,
      teamId: session.currentTeamId,
    },
    select: {
      name: true,
      colorBgBase: true,
      colorBgPrimary: true,
      colorBgSecondary: true,
      colorLabelPrimary: true,
      colorLabelSecondary: true,
      colorLabelTertiary: true,
      colorBorderPrimary: true,
      font: true,
      backgroundImage: true,
    },
  });

  if (!theme) {
    return {
      error: 'Theme not found',
    };
  }

  return {
    theme,
  };
}

export async function setPageTheme(pageSlug: string, themeId: string) {
  const session = await auth();

  if (!session || !session.currentTeamId) {
    return {
      error: 'Unauthorized',
    };
  }

  if (!pageSlug) {
    return {
      error: 'Page slug is required',
    };
  }

  if (!themeId) {
    return {
      error: 'Theme ID is required',
    };
  }

  try {
    await prisma.page.update({
      where: {
        slug: pageSlug,
        deletedAt: null,
        team: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      data: {
        theme: {
          connect: {
            id: themeId,
          },
        },
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    captureException(error);
    return {
      error: 'Failed to set page theme',
    };
  }
}
