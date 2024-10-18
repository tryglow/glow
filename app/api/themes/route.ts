import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

/** Returns the themes for the current team */
export async function GET() {
  const session = await auth();

  if (!session || !session.currentTeamId) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }

  const themes = await prisma.theme.findMany({
    where: {
      teamId: session.currentTeamId,
      isDefault: false,
    },
  });

  const defaultThemes = await prisma.theme.findMany({
    where: {
      isDefault: true,
    },
  });

  return NextResponse.json([...defaultThemes, ...themes]);
}
