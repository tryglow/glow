import prisma from '@/lib/prisma';

const themeFields = {
  id: true,
  isDefault: true,
  name: true,
  colorBgBase: true,
  colorBgPrimary: true,
  colorBgSecondary: true,
  colorBorderPrimary: true,
  colorLabelPrimary: true,
  colorLabelSecondary: true,
  colorLabelTertiary: true,
};

export async function getThemesForTeam(teamId: string) {
  const themes = await prisma.theme.findMany({
    where: {
      teamId,
      isDefault: false,
    },
    select: themeFields,
  });

  const defaultThemes = await prisma.theme.findMany({
    where: {
      isDefault: true,
    },
    select: themeFields,
  });

  return [...defaultThemes, ...themes];
}
