import { track } from '@vercel/analytics/server';
import { randomUUID } from 'crypto';
import { getSession } from 'next-auth/react';

import { defaults as headerDefaults } from './blocks/header/config';
import prisma from './prisma';

export const MAX_PAGES_PER_TEAM = 10;

interface NewPageInput {
  slug: string;
  themeId: string;
}

export async function createNewPage(teamId: string, input: NewPageInput) {
  const headerSectionId = randomUUID();
  const session = await getSession();

  if (!session) {
    return null;
  }

  await track('pageCreated', {
    teamId,
    slug: input.slug,
  });

  return prisma.page.create({
    data: {
      // Temporary until we drop userId from the page model
      userId: session.user.id,
      teamId,
      slug: input.slug,
      publishedAt: new Date(),
      themeId: input.themeId,
      metaTitle: 'Hello World',
      config: [
        {
          h: 6,
          i: headerSectionId,
          w: 12,
          x: 0,
          y: 0,
          moved: false,
          static: false,
        },
      ],
      mobileConfig: [
        {
          h: 6,
          i: headerSectionId,
          w: 12,
          x: 0,
          y: 0,
          moved: false,
          static: false,
        },
      ],
      blocks: {
        create: {
          id: headerSectionId,
          type: 'header',
          config: {},
          data: headerDefaults as any,
        },
      },
    },
    select: {
      slug: true,
    },
  });
}
