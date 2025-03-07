import { getSession } from '@/app/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  const session = await getSession({
    fetchOptions: { headers: await headers() },
  });

  const { user, session: sessionData } = session?.data ?? {};

  if (!user || !sessionData?.activeOrganizationId) {
    return redirect('/');
  }

  const pages = await prisma.page.findMany({
    where: {
      organizationId: sessionData?.activeOrganizationId,
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
