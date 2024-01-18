import { requestLongLivedToken, requestToken } from './utils'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface InstagramTokenResponse {
  access_token: string
  user_id: number
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const session = await getServerSession(authOptions)

  if (!session) {
    return Response.json({
      error: {
        message: 'Unauthorized',
      },
    })
  }

  const code = searchParams.get('code')

  if (!code) {
    return Response.json({
      error: {
        message: 'Error getting code',
      },
    })
  }

  try {
    const res = await requestToken({ code })

    const data = (await res.json()) as InstagramTokenResponse

    const longLivedTokenResponse = await requestLongLivedToken({
      accessToken: data.access_token,
    })

    const longLivedToken = await longLivedTokenResponse.json()

    await prisma.integration.create({
      data: {
        userId: session.user.id,
        type: 'instagram',
        config: {
          accessToken: longLivedToken.access_token,
          instagramUserId: data.user_id,
        },
      },
    })

    return Response.json({
      data,
    })
  } catch (error) {
    console.error('Error getting token', error)
    return Response.json({
      error: {
        message: 'Error getting token',
      },
    })
  }
}
