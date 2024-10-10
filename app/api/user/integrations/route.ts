import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await auth();

  const user = session?.user;

  if (!user) {
    return Response.json({
      error: {
        message: 'Authentication required',
      },
    });
  }

  const integrations = await prisma.integration.findMany({
    select: {
      id: true,
      createdAt: true,
      type: true,
    },
    where: {
      userId: user.id,
      deletedAt: null,
    },
  });

  return Response.json(integrations);
}
