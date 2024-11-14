'use client';

import { FunctionComponent } from 'react';
import useSWR from 'swr';

import { CoreBlock } from '@/components/CoreBlock';

import { BlockProps } from '../ui';
import { ImageBlockConfig } from './config';

export const Image: FunctionComponent<BlockProps> = (props) => {
  const { data: resp } = useSWR<ImageBlockConfig>(`/api/blocks/${props.blockId}`);

  const { data }: any = resp

  return (
    <CoreBlock className="relative !p-0 overflow-hidden" {...props}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data?.src}
        className="absolute w-full h-full object-cover"
        alt=""
      />
    </CoreBlock>
  );
};
