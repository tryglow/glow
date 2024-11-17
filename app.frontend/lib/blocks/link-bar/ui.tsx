'use client';

import Link from 'next/link';
import useSWR from 'swr';

import { CoreBlock } from '@/components/CoreBlock';

import { BlockProps } from '../ui';
import { LinkBarBlockConfig } from './config';

export function LinkBar(props: BlockProps) {
  const { data } = useSWR<{ blockData: LinkBarBlockConfig }>(
    `/api/blocks/${props.blockId}`
  );

  const { blockData } = data || {};

  return (
    <CoreBlock {...props} isFrameless className="items-center flex">
      <div className="flex flex-row gap-4 items-center justify-center w-full">
        {blockData?.links.map((link) => {
          return (
            <Link key={link.link} href={link.link}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={link?.icon?.src}
                className="w-10 h-10 rounded-md"
                alt=""
              />
            </Link>
          );
        })}
      </div>
    </CoreBlock>
  );
}
