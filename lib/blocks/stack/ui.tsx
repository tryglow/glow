'use client';

import { FunctionComponent } from 'react';
import useSWR from 'swr';

import { CoreBlock } from '@/app/components/CoreBlock';

import { BlockProps } from '../ui';
import { StackBlockConfig } from './config';

export const Stack: FunctionComponent<BlockProps> = (props) => {
  const { data } = useSWR<StackBlockConfig>(`/api/blocks/${props.blockId}`);

  if (!data) return null;

  return (
    <CoreBlock {...props}>
      <h2 className="text-2xl font-medium text-sys-label-primary">
        {data?.title}
      </h2>
      <p className="text-md text-sys-label-secondary">{data?.label}</p>

      <div className="flex flex-col gap-6 mt-6">
        {data?.items?.map((item) => {
          return (
            <div key={item.title} className="flex items-center gap-4">
              <img
                src={item.icon.src}
                alt=""
                className="w-10 h-10 rounded-md"
              />
              <div className="flex flex-col">
                <h3 className="font-medium text-sys-label-primary text-lg mb-0">
                  {item.title}
                </h3>
                <p className="text-sys-label-secondary -mt-1">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </CoreBlock>
  );
};
