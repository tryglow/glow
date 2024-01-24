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
      <CoreBlock {...props}>
        <div>
          <div className="flex flex-col gap-2">
            <div className="w-12 h-12 rounded-md bg-gray-600"></div>
            <div className="flex flex-col">
              <span className="font-semibold text-base text-stone-900">
                {data?.title}
              </span>
              <span className="text-stone-600 text-sm">{data?.label}</span>
            </div>
          </div>
        </div>
      </CoreBlock>
    );
  }

  return (
    <CoreBlock {...props}>
      <Link
        href={data?.link as string}
        target="_blank"
        rel="noopener noreferrer"
      >
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
