'use client';

import { FunctionComponent } from 'react';
import useSWR from 'swr';

import { CoreBlock } from '@/components/CoreBlock';

import { YouTubeBlockConfig } from '@/lib/blocks/youtube/config';
import { BlockProps } from '../ui';

export const YouTube: FunctionComponent<BlockProps> = (props) => {
  const { data: resp } = useSWR<YouTubeBlockConfig>(`/api/blocks/${props.blockId}`);

  const { data }: any = resp

  if (!data) return null;

  return (
    <CoreBlock {...props} className="flex flex-col" isFrameless>
      {data.videoId !== '' ? (
        <iframe
          src={`https://www.youtube.com/embed/${data.videoId}`}
          allowFullScreen
          title="YouTube video player"
          frameBorder={0}
          height="100%"
          className="rounded-3xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="text-sm text-sys-label-secondary text-center">
            Edit this block to add a YouTube video.
          </span>
        </div>
      )}
    </CoreBlock>
  );
};
