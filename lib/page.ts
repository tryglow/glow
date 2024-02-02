import { randomUUID } from 'crypto';

import { defaults as headerDefaults } from './blocks/header/config';
import prisma from './prisma';

export const MAX_PAGES_PER_USER = 10;

export function createNewPage(userId: string, pageSlug: string) {
  const headerSectionId = randomUUID();

  return prisma.page.create({
    data: {
      userId,
      slug: pageSlug,
      publishedAt: new Date(),
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
