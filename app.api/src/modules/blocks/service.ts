import prisma from '@/lib/prisma';
import { blocks, Blocks } from '@tryglow/blocks';
import { User } from '@tryglow/prisma';

export async function getBlockById(blockId: string) {
  const block = await prisma.block.findUnique({
    where: {
      id: blockId,
    },
    include: {
      page: {
        select: {
          publishedAt: true,
          teamId: true,
        },
      },
      integration: {
        select: {
          id: true,
          type: true,
          createdAt: true,
        },
      },
    },
  });

  return block;
}

export async function createBlock(
  block: { type: string; id: string },
  pageSlug: string
) {
  const defaultData = blocks[block.type as Blocks].defaults;

  const newBlock = await prisma.block.create({
    data: {
      type: block.type,
      id: block.id,
      config: {},
      data: defaultData,
      page: {
        connect: {
          slug: pageSlug,
        },
      },
    },
  });

  return newBlock;
}

export async function getEnabledBlocks(user: User) {
  if (!user) {
    return [];
  }

  const enabledBlocks: Blocks[] = [];

  Object.entries(blocks).forEach(([key, block]) => {
    if (block.isBeta) {
      if (user?.isAdmin || user?.hasBetaAccess) {
        enabledBlocks.push(key as Blocks);
      }
    } else {
      enabledBlocks.push(key as Blocks);
    }
  });

  const filteredBlocks = enabledBlocks.filter((block) => block !== 'header');

  return filteredBlocks;
}
