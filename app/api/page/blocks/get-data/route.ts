import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return Response.json({
      message: 'error',
      data: null,
    })
  }

  const blockId = req.nextUrl.searchParams.get('blockId')

  if (!blockId) {
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    })
  }

  const block = await prisma.block.findUnique({
    where: {
      id: blockId,
      page: {
        userId: session.user.id,
      },
    },
  })

  if (!block) {
    return Response.json({
      error: {
        message: 'Block not found',
      },
    })
  }

  return Response.json({
    data: {
      block: block.data,
    },
  })
}