'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { SWRConfig, SWRConfiguration } from 'swr';

import { SidebarProvider } from '@/app/components/ui/sidebar';
import { fetcher } from '@/lib/fetch';

interface Props {
  children: ReactNode;
  value: SWRConfiguration;
  session: Session | null;
}

const WithSidebarProvider = ({
  children,
  session,
}: Pick<Props, 'children' | 'session'>) => {
  if (!session) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider
      security="s"
      style={
        {
          '--sidebar-width': '390px',
        } as React.CSSProperties
      }
    >
      {children}
    </SidebarProvider>
  );
};

export const GlowProviders = ({ children, value, session }: Props) => {
  return (
    <SWRConfig value={{ ...value, fetcher }}>
      <SessionProvider session={session}>
        <WithSidebarProvider session={session}>{children}</WithSidebarProvider>
      </SessionProvider>
    </SWRConfig>
  );
};
