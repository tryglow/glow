'use client';

import { ReactNode } from 'react';
import { SWRConfig } from 'swr';

interface Props {
  children: ReactNode;
  value: any;
}
export const SWRProvider = ({ children, value }: Props) => {
  return <SWRConfig value={value}>{children}</SWRConfig>;
};
