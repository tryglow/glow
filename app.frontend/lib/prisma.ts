import { withAccelerate } from '@prisma/extension-accelerate';
import { withOptimize } from '@prisma/extension-optimize';
import { PrismaClient } from '@trylinky/prisma';
import 'server-only';

const prismaClientSingleton = () => {
  if (!process.env.PRISMA_OPTIMIZE_API_KEY) {
    return new PrismaClient()
      .$extends({
        query: {
          async $allOperations({ model, operation, args, query }) {
            const before = Date.now();
            const result = await query(args);
            const after = Date.now();

            console.log(`Query ${model}.${operation} took ${after - before}ms`);

            return result;
          },
        },
      })
      .$extends(withAccelerate());
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
