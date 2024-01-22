import { ReactNode } from 'react';
import MarketingNavigation from '../components/MarketingNavigation';
import MarketingFooter from '../components/MarketingFooter';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { LoginWidget } from '../components/LoginWidget';
import { Button } from '@/components/ui/button';
import { UserWidget } from '../components/UserWidget';

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
  });

  return {
    user,
    pages,
  };
};

export default async function IPageLayout({ children }: Props) {
  const { user, pages } = await fetchUserAndPages();

  return (
    <>
      <MarketingNavigation>
        {user ? (
          <UserWidget user={user} usersPages={pages} />
        ) : (
          <>
            <LoginWidget
              trigger={
                <Button variant="ghost" className="hidden lg:block">
                  Log in
                </Button>
              }
            />

            <LoginWidget trigger={<Button>Create Page</Button>} />
          </>
        )}
      </MarketingNavigation>
      <main>{children}</main>
      <MarketingFooter />
    </>
  );
}
