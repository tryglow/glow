'use client';

import { ReactNode } from 'react';
import { SWRConfig, SWRConfiguration } from 'swr';

import { fetcher } from '@/lib/fetch';

interface Props {
  children: ReactNode;
  value: SWRConfiguration;
}
export const SWRProvider = ({ children, value }: Props) => {
  return <SWRConfig value={{ ...value, fetcher }}>{children}</SWRConfig>;
};
