'use server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const fetchPageSettings = async (slug: string) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const page = await prisma.page.findUnique({
    where: {
      slug,
      userId: session.user.id,
    },
    select: {
      id: true,
      publishedAt: true,
      slug: true,
      metaTitle: true,
      metaDescription: true,
    },
  })

  return {
    page,
  }
}
