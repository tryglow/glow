import { FunctionComponent, Suspense } from 'react';

import { CoreBlock } from '@/app/components/CoreBlock';

import { BlockProps } from '../ui';
import { SpotifyPlayingNowServerUI } from './ui-server';

export const SpotifyPlayingNow: FunctionComponent<BlockProps> = ({
  pageId,
  ...otherProps
}) => {
  return (
    <CoreBlock
      pageId={pageId}
      className="bg-gradient-to-tr from-[#1DB954] to-[#37bc66]"
      {...otherProps}
    >
      <Suspense fallback={<LoadingState />}>
        <SpotifyPlayingNowServerUI pageId={pageId} />
      </Suspense>
    </CoreBlock>
  );
};

export const LoadingState = () => {
  return (
    <div className="bg-system-bg-primary bg-gradient-to-tr from-[#0daa44] to-[#5acd83] border-system-bg-secondary border p-6 rounded-3xl">
      <div className="flex gap-3">
        <div className="w-16 h-16 object-cover rounded-xl bg-white/20" />

        <div className="flex flex-col justify-center">
          <p className="text-sm text-system-bg-primary uppercase font-medium">
            ------
          </p>
          <p className="text-md text-white font-bold">----</p>
          <p className="text-sm text-white">---</p>
        </div>
      </div>
    </div>
  );
};

export default SpotifyPlayingNow;
