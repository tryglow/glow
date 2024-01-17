import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

import { defaults } from '@/lib/blocks/defaults'
import { Blocks } from '@/lib/blocks/types'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return Response.json({
      message: 'error',
      data: null,
    })
  }

  const bodyData = await req.json()

  const { block, pageSlug, layout } = bodyData

  if (!block || !pageSlug || !layout) {
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    })
  }

  const page = await prisma.page.findUnique({
    where: {
      userId: session.user.id,
      slug: pageSlug,
    },
  })

  if (!page) {
    return Response.json({
      error: {
        message: 'Page not found',
      },
    })
  }

  const defaultData = defaults[block.type as Blocks]

  const newBlock = await prisma.block.create({
    data: {
      type: block.type,
      id: block.id,
      config: {},
      data: defaultData,
      page: {
        connect: {
          slug: pageSlug,
        },
      },
    },
  })

  const updatedPage = await prisma.page.update({
    where: {
      slug: pageSlug,
    },
    data: {
      config: layout,
    },
  })

  return Response.json({
    data: {
      block: newBlock,
      layout: updatedPage.config,
    },
  })
}
