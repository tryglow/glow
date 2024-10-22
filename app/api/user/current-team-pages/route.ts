import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const teamPages = await prisma.page.findMany({
    where: {
      deletedAt: null,
      teamId: session.currentTeamId,
    },
  });

  return NextResponse.json(teamPages);
}
