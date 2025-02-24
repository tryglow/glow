import { auth } from '@/app/lib/auth';
import { LoginWidget } from '@/components/LoginWidget';
import MarketingFooter from '@/components/MarketingFooter';
import MarketingNavigation from '@/components/MarketingNavigation';
import prisma from '@/lib/prisma';
import { Button } from '@tryglow/ui';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const fetchCurrentTeamAndPages = async () => {
  const session = await auth();

  if (!session?.user) {
    return {
      user: null,
      pages: [],
    };
  }

  const pages = await prisma.page.findMany({
    where: {
      deletedAt: null,
      teamId: session?.currentTeamId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return {
    pages,
  };
};

export default async function IPageLayout({ children }: Props) {
  const { pages } = await fetchCurrentTeamAndPages();

  const session = await auth();

  const loggedInUserRedirect =
    session?.user && pages[0] ? `/${pages[0].slug}` : '/new';

  return (
    <>
      <MarketingNavigation>
        {session?.user ? (
          <Button asChild variant="ghost">
            <Link href={loggedInUserRedirect}>Go to app →</Link>
          </Button>
        ) : (
          <>
            <LoginWidget
              trigger={
                <Button variant="ghost" className="block">
                  Log in
                </Button>
              }
            />
            <LoginWidget
              isSignup
              trigger={<Button className="block">Get started</Button>}
            />
          </>
        )}
      </MarketingNavigation>
      <main className="bg-white min-h-full">{children}</main>
      <MarketingFooter />
    </>
  );
}
