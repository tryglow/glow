import { Theme } from '@prisma/client';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { Button } from '@/components/ui/button';

import { LoginWidget } from '../components/LoginWidget';
import { UserWidget } from '../components/UserWidget';

export const dynamic = 'force-dynamic';

const fetchUserLoggedinStatus = async () => {
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

const fetchPageTheme = (slug: string) => {
  return prisma.page.findUnique({
    where: {
      slug,
    },
    select: {
      theme: true,
      backgroundImage: true,
    },
  });
};
export default async function PageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}) {
  const { user, pages } = await fetchUserLoggedinStatus();

  const { theme, backgroundImage } = (await fetchPageTheme(params.slug)) as {
    theme: Theme | null;
    backgroundImage?: string;
  };

  console.log('Psfsfage Theme', backgroundImage);

  return (
    <>
      {user ? (
        <div className="fixed top-10 left-10">
          <UserWidget user={user} usersPages={pages} />
        </div>
      ) : (
        <LoginWidget
          trigger={
            <Button className="fixed z-50 top-3 right-3">Create a Page</Button>
          }
        />
      )}

      <div className="w-full max-w-2xl mx-auto px-3 md:px-6 gap-3 pt-16 pb-8">
        {children}
      </div>

      <footer className="w-full max-w-2xl mx-auto text-center py-6 border-t border-sys-bg-border">
        <Link href="/" className="flex flex-col items-center">
          <span className="text-sys-label-primary text-xs">
            Powered by Glow
          </span>
          <svg viewBox="0 0 196 240" width={20} fill="none" className="mt-4">
            <path
              style={{ fill: 'var(--color-sys-label-primary' }}
              fillOpacity={0.8}
              fillRule="evenodd"
              d="M76.4539 239.092C142.477 239.092 196 185.57 196 119.546 196 53.5226 142.477 0 76.4539 0v43.0922C34.2296 43.0922.0000037 77.3217 0 119.546-.0000037 161.77 34.2296 196 76.4539 196v43.092ZM76.454 196c42.224 0 76.454-34.23 76.454-76.454 0-42.2242-34.23-76.4538-76.454-76.4538V196Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </footer>
      {backgroundImage && (
        <style>
          {`body {
            background: url(${backgroundImage}) no-repeat center center / cover fixed;
          }`}
        </style>
      )}
      {theme && (
        <style>
          {`:root {
          --color-sys-bg-base: ${theme.colorBgBase};
          --color-sys-bg-primary: ${theme.colorBgPrimary};
          --color-sys-bg-secondary: ${theme.colorBgSecondary};
          --color-sys-bg-border: ${theme.colorBorderPrimary};
          
          --color-sys-label-primary: ${theme.colorLabelPrimary};
          --color-sys-label-secondary: ${theme.colorLabelSecondary};
          --color-sys-label-tertiary: ${theme.colorLabelTertiary};
        }`}
        </style>
      )}
    </>
  );
}
