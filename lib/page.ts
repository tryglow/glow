import { track } from '@vercel/analytics/server';
import { randomUUID } from 'crypto';

import { defaults as headerDefaults } from './blocks/header/config';
import prisma from './prisma';

export const MAX_PAGES_PER_USER = 10;

interface NewPageInput {
  slug: string;
  themeId: string;
}

export async function createNewPage(userId: string, input: NewPageInput) {
  const headerSectionId = randomUUID();

  await track('pageCreated', {
    userId,
    slug: input.slug,
  });

  return prisma.page.create({
    data: {
      userId,
      slug: input.slug,
      publishedAt: new Date(),
      themeId: input.themeId,
      metaTitle: 'Hello World',
      config: [
        {
          h: 6,
          i: headerSectionId,
          w: 11,
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
