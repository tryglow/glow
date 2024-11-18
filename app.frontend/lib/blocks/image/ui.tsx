'use client';

import { BlockProps } from '../ui';
import { CoreBlock } from '@/components/CoreBlock';
import { ImageBlockConfig } from '@tryglow/blocks';
import { FunctionComponent } from 'react';
import useSWR from 'swr';

export const Image: FunctionComponent<BlockProps> = (props) => {
  const { data } = useSWR<{
    blockData: ImageBlockConfig;
  }>(`/api/blocks/${props.blockId}`);

  const { blockData } = data || {};

  return (
    <CoreBlock className="relative !p-0 overflow-hidden" {...props}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={blockData?.src}
        className="absolute w-full h-full object-cover"
        alt=""
      />
    </CoreBlock>
  );
};
