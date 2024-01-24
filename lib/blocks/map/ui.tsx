'use client';

import useSWR from 'swr';

import { CoreBlock } from '@/app/components/CoreBlock';

import { fetcher } from '@/lib/fetch';

import { BlockProps } from '../ui';
import { MapBlockConfig } from './config';
import { MapboxMap } from './ui-client';

export function Map(props: BlockProps) {
  const { data } = useSWR<MapBlockConfig>(
    `/api/blocks/${props.blockId}`,
    fetcher
  );

  if (!data?.coords) return null;

  return (
    <CoreBlock className="relative !p-0 overflow-hidden" {...props}>
      <MapboxMap
        className="absolute w-full h-full object-cover"
        coords={data?.coords}
      />
    </CoreBlock>
  );
}
