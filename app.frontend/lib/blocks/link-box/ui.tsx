'use client';

import { BlockProps } from '../ui';
import { CoreBlock } from '@/components/CoreBlock';
import { internalApiFetcher } from '@/lib/fetch';
import { LinkBoxBlockConfig } from '@tryglow/blocks';
import Link from 'next/link';
import useSWR from 'swr';

export function LinkBox(props: BlockProps) {
  const { data } = useSWR<{ blockData: LinkBoxBlockConfig }>(
    `/blocks/${props.blockId}`,
    internalApiFetcher
  );

  const { blockData } = data || {};

  return (
    <CoreBlock
      {...props}
      className="items-center flex"
      component={props.isEditable ? 'div' : Link}
      linkProps={
        props.isEditable
          ? {}
          : {
              href: blockData?.link ?? '',
              target: '_blank',
              rel: 'noopener noreferrer',
            }
      }
    >
      <div className="flex flex-row gap-4 items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={blockData?.icon?.src}
          className="w-10 h-10 rounded-md"
          alt=""
        />
        <div className="flex flex-col">
          <span className="font-semibold text-base text-sys-label-primary">
            {blockData?.title}
          </span>
          {blockData?.label && (
            <span className="text-sys-label-secondary text-xs">
              {blockData?.label}
            </span>
          )}
        </div>
      </div>
    </CoreBlock>
  );
}
