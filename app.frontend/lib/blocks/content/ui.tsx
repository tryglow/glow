'use client';

import { BlockProps } from '../ui';
import { CoreBlock } from '@/components/CoreBlock';
import { internalApiFetcher } from '@/lib/fetch';
import { ContentBlockConfig } from '@tryglow/blocks';
import { FunctionComponent } from 'react';
import useSWR from 'swr';

export const Content: FunctionComponent<BlockProps> = ({
  blockId,
  ...otherProps
}) => {
  const { data } = useSWR<{
    blockData: ContentBlockConfig;
  }>(`/blocks/${blockId}`, internalApiFetcher);

  const { blockData } = data || {};

  return (
    <CoreBlock {...otherProps} blockId={blockId} isFrameless>
      <div className="py-4 h-full overflow-hidden">
        <h2 className="text-2xl font-medium text-sys-label-primary">
          {blockData?.title}
        </h2>
        <p className="text-lg text-sys-label-secondary">{blockData?.content}</p>
      </div>
    </CoreBlock>
  );
};
