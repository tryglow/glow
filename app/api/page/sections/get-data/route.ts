import {getServerSession} from 'next-auth';
import {authOptions} from '@/lib/auth';
import prisma from '@/lib/prisma';

import {NextRequest} from 'next/server';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({
      message: 'error',
      data: null,
    });
  }

  const sectionId = req.nextUrl.searchParams.get('sectionId');

  if (!sectionId) {
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    });
  }

  const section = await prisma.section.findUnique({
    where: {
      id: sectionId,
      page: {
        userId: session.user.id,
      },
    },
  });

  if (!section) {
    return Response.json({
      error: {
        message: 'Section not found',
      },
    });
  }

  return Response.json({
    data: {
      section: section.data,
    },
  });
}
