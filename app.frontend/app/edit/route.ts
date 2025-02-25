import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return redirect('/');
  }

  if (!session?.currentTeamId) {
    return {
      pages: [],
    };
  }

  const pages = await prisma.page.findMany({
    where: {
      teamId: session?.currentTeamId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      slug: true,
    },
    take: 1,
  });

  if (!pages || pages.length === 0) {
    return redirect('/');
  }

  return redirect(`/${pages[0].slug}`);
}
