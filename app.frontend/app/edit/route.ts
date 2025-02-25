import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function GET() {
  const session = await auth();

  if (!session || !session.currentTeamId) {
    return redirect('/');
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
    return redirect('/new');
  }

  return redirect(`/${pages[0].slug}`);
}
