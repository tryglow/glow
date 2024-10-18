'use server';

import { ThemeData } from '@/app/components/EditPageSettingsDialog/shared';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function createTheme({
  themeName,
  colorBgBase,
  colorBgPrimary,
  colorBgSecondary,
  colorLabelPrimary,
  colorLabelSecondary,
  colorLabelTertiary,
  colorBorderPrimary,
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
    await prisma.theme.create({
      data: {
        name: themeName,
        isDefault: false,
        createdById: session.user.id,
        teamId: session.currentTeamId,
        colorBgBase,
        colorBgPrimary,
        colorBgSecondary,
        colorLabelPrimary,
        colorLabelSecondary,
        colorLabelTertiary,
        colorBorderPrimary,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
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
        colorLabelPrimary: data.colorLabelPrimary,
        colorLabelSecondary: data.colorLabelSecondary,
        colorLabelTertiary: data.colorLabelTertiary,
        colorBorderPrimary: data.colorBorderPrimary,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
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
