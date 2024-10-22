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
  currentUserIsOwner: boolean;
}

export const GlowProviders = ({
  children,
  value,
  currentUserIsOwner,
  session,
}: Props) => {
  return (
    <SWRConfig value={{ ...value, fetcher }}>
      <SessionProvider session={session}>
        <SidebarProvider
          style={
            {
              '--sidebar-width': '390px',
            } as React.CSSProperties
          }
          skipSidebar={!currentUserIsOwner}
        >
          {children}
        </SidebarProvider>
      </SessionProvider>
    </SWRConfig>
  );
};
