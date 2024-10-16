'use client';

import { FunctionComponent } from 'react';
import useSWR from 'swr';

import { CoreBlock } from '@/components/CoreBlock';

import { BlockProps } from '../ui';
import { ImageBlockConfig } from './config';

export const Image: FunctionComponent<BlockProps> = (props) => {
  const { data } = useSWR<ImageBlockConfig>(`/api/blocks/${props.blockId}`);

  return (
    <CoreBlock className="relative !p-0 overflow-hidden" {...props}>
      <img src={data?.src} className="absolute w-full h-full object-cover" />
    </CoreBlock>
  );
};
