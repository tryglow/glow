import { getServerSession } from 'next-auth'
import { LoginWidget } from '../components/LoginWidget'
import { authOptions } from '@/lib/auth'

const fetchUserLoggedinStatus = async () => {
  const session = await getServerSession(authOptions)

  const user = session?.user

  return {
    isUserLoggedIn: Boolean(user),
  }
}

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isUserLoggedIn } = await fetchUserLoggedinStatus()
  return (
    <>
      {!isUserLoggedIn && <LoginWidget />}

      <div className="w-full max-w-2xl mx-auto px-3 md:px-6 gap-3 pt-16 pb-8">
        {children}
      </div>

      <footer className="w-full max-w-2xl mx-auto text-center py-6 border-t border-gray-200">
        <span className="text-system-label-secondary/50 text-xs">
          Powered by onedash
        </span>
      </footer>
    </>
  )
}
