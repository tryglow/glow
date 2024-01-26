'use client';

import Link from 'next/link';
import useSWR from 'swr';

import { CoreBlock } from '@/app/components/CoreBlock';

import { fetcher } from '@/lib/fetch';

import { BlockProps } from '../ui';
import { LinkBoxBlockConfig } from './config';

export function LinkBox(props: BlockProps) {
  const { data } = useSWR<LinkBoxBlockConfig>(
    `/api/blocks/${props.blockId}`,
    fetcher
  );

  if (props.isEditable) {
    return (
      <CoreBlock {...props} className="items-center flex">
        <div className="flex flex-row gap-4 items-center">
          <img src={data?.icon?.src} className="w-10 h-10 rounded-md" />
          <div className="flex flex-col">
            <span className="font-semibold text-base text-stone-900">
              {data?.title}
            </span>
            {data?.label && (
              <span className="text-stone-600 text-xs">{data?.label}</span>
            )}
          </div>
        </div>
      </CoreBlock>
    );
  }

  return (
    <CoreBlock {...props}>
      <Link href={data?.link ?? ''} target="_blank" rel="noopener noreferrer">
        <div className="flex flex-col gap-2">
          <div className="w-12 h-12 rounded-md bg-gray-600"></div>
          <div className="flex flex-col">
            <span className="font-semibold text-base text-stone-900">
              {data?.title}
            </span>
            <span className="text-stone-600 text-sm">{data?.label}</span>
          </div>
        </div>
      </Link>
    </CoreBlock>
  );
}
