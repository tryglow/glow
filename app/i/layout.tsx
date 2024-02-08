import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { ReactNode } from 'react';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { Button } from '@/components/ui/button';

import { ClaimInviteDialog } from '../components/ClaimInviteDialog';
import { LoginWidget } from '../components/LoginWidget';
import MarketingFooter from '../components/MarketingFooter';
import MarketingNavigation from '../components/MarketingNavigation';

interface Props {
  children: ReactNode;
}

const fetchUserAndPages = async () => {
  const session = await getServerSession(authOptions);

  const user = session?.user;

  const pages = await prisma.page.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return {
    user,
    pages,
  };
};

export default async function IPageLayout({ children }: Props) {
  const { user, pages } = await fetchUserAndPages();

  const firstPage = pages[0];

  return (
    <>
      <MarketingNavigation>
        {user ? (
          <Button asChild variant="ghost">
            <Link href={firstPage ? `/${firstPage.slug}` : `/new`}>
              Go to app →
            </Link>
          </Button>
        ) : (
          <>
            <LoginWidget
              trigger={
                <Button variant="ghost" className="hidden lg:block">
                  Log in
                </Button>
              }
            />

            <ClaimInviteDialog
              trigger={<Button className="font-bold">Claim Invite</Button>}
            />
          </>
        )}
      </MarketingNavigation>
      <main className="bg-white">{children}</main>
      <MarketingFooter />
    </>
  );
}
