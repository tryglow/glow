'use client';

import Link from 'next/link';
import useSWR from 'swr';

import { CoreBlock } from '@/app/components/CoreBlock';

import { BlockProps } from '../ui';
import { LinkBarBlockConfig } from './config';

export function LinkBar(props: BlockProps) {
  const { data } = useSWR<LinkBarBlockConfig>(`/api/blocks/${props.blockId}`);

  return (
    <CoreBlock {...props} isFrameless className="items-center flex">
      <div className="flex flex-row gap-4 items-center justify-center w-full">
        {data?.links.map((link) => {
          return (
            <Link key={link.link} href={link.link}>
              <img src={link?.icon?.src} className="w-10 h-10 rounded-md" />
            </Link>
          );
        })}
      </div>
    </CoreBlock>
  );
}
