import { auth } from '@/app/lib/auth';
import { blocksConfig } from '@/lib/blocks/config';
import { Blocks } from '@/lib/blocks/types';
import prisma from '@/lib/prisma';
import safeAwait from 'safe-await';

export async function getEnabledBlocks() {
  const session = await auth();

  if (!session) {
    return [];
  }

  const [userError, user] = await safeAwait(
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        hasBetaAccess: true,
        isAdmin: true,
      },
      cacheStrategy: { ttl: 60 },
    })
  );

  if (userError) {
    return [];
  }

  const enabledBlocks: Blocks[] = [];

  Object.entries(blocksConfig).forEach(([key, block]) => {
    if (block.isBeta) {
      if (user?.isAdmin || user?.hasBetaAccess) {
        enabledBlocks.push(key as Blocks);
      }
    } else {
      enabledBlocks.push(key as Blocks);
    }
  });

  return enabledBlocks;
}
