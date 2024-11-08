// import 'server-only';

import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { withOptimize } from '@prisma/extension-optimize';

const prismaClientSingleton = () => {
  if (!process.env.PRISMA_OPTIMIZE_API_KEY) {
    console.warn('Prisma Optimize is not enabled');
    return new PrismaClient();
  }

  return new PrismaClient()
    .$extends(withOptimize({ apiKey: process.env.PRISMA_OPTIMIZE_API_KEY }))
    .$extends(withAccelerate());
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
