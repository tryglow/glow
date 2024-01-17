import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { LoginWidget } from '../components/LoginWidget'

const fetchUsersPages = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const page = await prisma.page.findFirst({
    where: {
      userId: session?.user?.id,
    },
    select: {
      slug: true,
    },
  })

  if (!page) {
    return null
  }

  return page
}

export default async function OnboardingPage() {
  const usersPage = await fetchUsersPages()
  const session = await getServerSession(authOptions)

  if (usersPage) {
    return redirect(`/${usersPage.slug}`)
  }

  if (!session?.user) {
    return <LoginWidget />
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold">Onboarding</h1>
    </div>
  )
}
