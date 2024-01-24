'use client';

import { FunctionComponent } from 'react';
import useSWR from 'swr';

import { CoreBlock } from '@/app/components/CoreBlock';

import { fetcher } from '@/lib/fetch';

import { BlockProps } from '../ui';
import { StackBlockConfig } from './config';

export const Stack: FunctionComponent<BlockProps> = (props) => {
  const { data, error } = useSWR<StackBlockConfig>(
    `/api/blocks/${props.blockId}`,
    fetcher
  );

  console.log('data', data);
  console.log('error', error);

  if (!data) return null;

  return (
    <CoreBlock {...props}>
      <h2 className="text-2xl font-medium text-system-label-primary">
        {data?.title}
      </h2>
      <p className="text-md text-system-label-secondary">{data?.label}</p>

      <div className="flex flex-col gap-6 mt-6">
        {data?.items.map((item) => {
          return (
            <div key={item.title} className="flex items-center gap-4">
              <img
                src={item.icon.src}
                alt=""
                className="w-10 h-10 rounded-md"
              />
              <div className="flex flex-col">
                <h3 className="font-medium text-system-label-primary text-lg mb-0">
                  {item.title}
                </h3>
                <p className="text-system-label-secondary -mt-1">
                  {item.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </CoreBlock>
  );
};
