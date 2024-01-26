'use client';

import { FunctionComponent } from 'react';
import useSWR from 'swr';

import { CoreBlock } from '@/app/components/CoreBlock';

import { BlockProps } from '../ui';
import { ContentBlockConfig } from './config';

export const Content: FunctionComponent<BlockProps> = (props) => {
  const { data } = useSWR<ContentBlockConfig>(`/api/blocks/${props.blockId}`);

  return (
    <CoreBlock {...props} isFrameless>
      <div className="py-4 h-full overflow-hidden">
        <h2 className="text-2xl font-medium text-sys-label-primary">
          {data?.title}
        </h2>
        <p className="text-lg text-sys-label-secondary">{data?.content}</p>
      </div>
    </CoreBlock>
  );
};
