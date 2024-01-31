import { Theme } from '@prisma/client';
import { randomUUID } from 'crypto';

import { defaults as headerDefaults } from './blocks/header/config';
import prisma from './prisma';

export const MAX_PAGES_PER_USER = 2;

export function createNewPage(userId: string, pageSlug: string) {
  const headerSectionId = randomUUID();

  return prisma.page.create({
    data: {
      userId,
      slug: pageSlug,
      publishedAt: new Date(),
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

export const defaultThemes = [
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
    name: 'Green',
  },
];
