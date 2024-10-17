'use client';

import dynamic from 'next/dynamic';
import useSWR from 'swr';

import { CoreBlock } from '@/components/CoreBlock';

import { BlockProps } from '../ui';
import { MapBlockConfig } from './config';
import { Props as DynamicMapboxMapProps } from './ui-client';

// Dynamically import MapboxMap
const DynamicMapboxMap = dynamic<DynamicMapboxMapProps>(
  () => import('./ui-client').then((mod) => mod.MapboxMap),
  { ssr: false }
);

export function Map(props: BlockProps) {
  const { data } = useSWR<MapBlockConfig>(`/api/blocks/${props.blockId}`);

  if (!data?.coords) return null;

  return (
    <CoreBlock className="relative !p-0 overflow-hidden" {...props}>
      <DynamicMapboxMap
        className="absolute w-full h-full object-cover"
        coords={data?.coords}
      />
    </CoreBlock>
  );
}
