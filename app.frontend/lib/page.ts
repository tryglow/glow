import { track } from '@vercel/analytics/server';
import { randomUUID } from 'crypto';

import { auth } from '@/app/lib/auth';

import { defaults as headerDefaults } from './blocks/header/config';
import prisma from './prisma';

export const MAX_PAGES_PER_TEAM = 10;

interface NewPageInput {
  slug: string;
  themeId: string;
}

export async function createNewPage(input: NewPageInput) {
  const headerSectionId = randomUUID();
  const session = await auth();

  if (!session) {
    return null;
  }

  await track('pageCreated', {
    teamId: session.currentTeamId,
    slug: input.slug,
  });

  return prisma.page.create({
    data: {
      // Temporary until we drop userId from the page model
      userId: session.user.id,
      teamId: session.currentTeamId,
      slug: input.slug,
      publishedAt: new Date(),
      themeId: input.themeId,
      metaTitle: `@${input.slug}`,
      config: [
        {
          h: 5,
          i: headerSectionId,
          w: 12,
          x: 0,
          y: 0,
          moved: false,
          static: true,
        },
      ],
      mobileConfig: [
        {
          h: 5,
          i: headerSectionId,
          w: 12,
          x: 0,
          y: 0,
          moved: false,
          static: true,
        },
      ],
      blocks: {
        create: {
          id: headerSectionId,
          type: 'header',
          config: {},
          data: {
            ...headerDefaults,
            title: `@${input.slug}`,
          },
        },
      },
    },
    select: {
      slug: true,
    },
  });
}
