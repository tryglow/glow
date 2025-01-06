import { NextRequest } from 'next/server';

import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return Response.json({
      message: 'error',
      data: null,
    });
  }

  const slug = req.nextUrl.searchParams.get('slug');

  if (!slug) {
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    });
  }

  const block = await prisma.page.findUnique({
    where: { slug },
  });

  if (!block) {
    return Response.json({
      error: {
        message: 'Block not found',
      },
    });
  }

  return Response.json({ block });
}
