'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { SWRConfig, SWRConfiguration } from 'swr';

import { fetcher } from '@/lib/fetch';

interface Props {
  children: ReactNode;
  value: SWRConfiguration;
  session: Session | null;
}

export const GlowProviders = ({ children, value, session }: Props) => {
  return (
    <SWRConfig value={{ ...value, fetcher }}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </SWRConfig>
  );
};
