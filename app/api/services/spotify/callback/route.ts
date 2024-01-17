import { NextResponse } from 'next/server'
import { requestToken } from './utils'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const session = await getServerSession(authOptions)

  if (!session) {
    NextResponse.json({ error: 'Unauthorized' })
    return
  }

  const code = searchParams.get('code')

  if (!code) {
    NextResponse.json({ error: 'Error getting token' })
    return
  }

  try {
    const res = await requestToken({ code })
    const json = await res.json()

    const integration = await prisma.integration.create({
      data: {
        userId: session.user.id,
        type: 'spotify',
        config: {
          accessToken: json.access_token,
          refreshToken: json.refresh_token,
        },
      },
    })

    return NextResponse.json({ json })
  } catch (error) {
    console.error('Error getting token', error)

    NextResponse.json({ error: 'Error getting token' })
  }
}
