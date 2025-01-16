'use client';

import Image from 'next/image';
import { FunctionComponent, Suspense } from 'react';

import { CoreBlock } from '@/components/CoreBlock';

import { BlockProps } from '../ui';
import { HeaderBlockConfig } from './config';
import { HeaderServerUI } from './ui-server';
import useSWR from 'swr';

export const Header: FunctionComponent<BlockProps & HeaderBlockConfig> = ({
  ...otherProps
}) => {
  const { data } = useSWR<any>(`/api/blocks/${otherProps.blockId}`);
  const { 
    title,
    description,
    avatar,
    showVerifiedBadge,
    verifiedPageTitle, } = data?.data || {} 

  return (
    <CoreBlock {...otherProps} isFrameless>
      <header className="py-4">
        {avatar?.src && (
          <Image
            src={avatar?.src}
            alt=""
            width={80}
            height={80}
            className="mb-6 rounded-full object-cover object-top"
          />
        )}
        <h1 className="font-bold text-4xl mb-1 text-sys-label-primary flex items-center gap-2">
          {showVerifiedBadge ? (
            <Suspense>
              <HeaderServerUI
                pageId={otherProps.pageId}
                verifiedPageTitle={verifiedPageTitle}
                title={title}
              />
            </Suspense>
          ) : (
            title
          )}
        </h1>
        <p className="text-2xl text-sys-label-secondary">{description}</p>
      </header>
    </CoreBlock>
  );
};
