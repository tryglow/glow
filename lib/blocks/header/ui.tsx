'use client';

import Image from 'next/image';
import { FunctionComponent } from 'react';
import useSWR from 'swr';

import { CoreBlock } from '@/app/components/CoreBlock';

import { fetcher } from '@/lib/fetch';

import { BlockProps } from '../ui';
import { HeaderBlockConfig } from './config';

export const Header: FunctionComponent<BlockProps> = (props) => {
  const { data } = useSWR<HeaderBlockConfig>(
    `/api/blocks/${props.blockId}`,
    fetcher
  );

  return (
    <CoreBlock {...props}>
      <header className="py-4">
        {data?.avatar?.src && (
          <Image
            src={data.avatar.src}
            alt=""
            width={80}
            height={80}
            className="mb-6 rounded-lg"
          />
        )}
        <h1 className="font-medium text-4xl mb-1 text-system-label-primary">
          {data?.title}
        </h1>
        <p className="text-2xl text-system-label-secondary">
          {data?.description}
        </p>
      </header>
    </CoreBlock>
  );
};
