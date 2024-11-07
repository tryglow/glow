import { FunctionComponent, Suspense } from 'react';

import { CoreBlock } from '@/components/CoreBlock';

import { Skeleton } from '@/components/ui/skeleton';

import { BlockProps } from '../ui';
import { TikTokLatestPostBlockConfig } from './config';
import { TikTokLatestPostServerUI } from './ui-server';

export const TikTokLatestPost: FunctionComponent<
  BlockProps & TikTokLatestPostBlockConfig
> = ({ pageId, ...otherProps }) => {
  return (
    <CoreBlock pageId={pageId} {...otherProps} isFrameless>
      <Suspense fallback={<LoadingState />}>
        <TikTokLatestPostServerUI pageId={pageId} />
      </Suspense>
    </CoreBlock>
  );
};

export const LoadingState = () => {
  return (
    <div className="absolute w-full bottom-0 px-2 py-6 flex flex-col h-full justify-between">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-10 w-8 rounded-full" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-[40px]" />
        </div>
      </div>
    </div>
  );
};

export default TikTokLatestPost;
