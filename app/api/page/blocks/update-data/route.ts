import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return Response.json({
      message: 'error',
      data: null,
    })
  }

  const bodyData = await req.json()

  const { blockId, newData } = bodyData

  if (!blockId || !newData) {
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

  // TODO - validate newData against schema

  const updatedBlock = await prisma.block.update({
    where: {
      id: blockId,
    },
    data: {
      data: newData,
    },
  })

  return Response.json({
    data: {
      block: updatedBlock,
    },
  })
}
