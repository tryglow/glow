import { BlockProps } from '../ui';
import { ThreadsFollowerCountServerUI } from './ui-server';
import { CoreBlock } from '@/components/CoreBlock';
import { ThreadsFollowerCountBlockConfig } from '@tryglow/blocks';
import { Skeleton } from '@tryglow/ui';
import { FunctionComponent, Suspense } from 'react';

export const ThreadsFollowerCount: FunctionComponent<
  BlockProps & ThreadsFollowerCountBlockConfig
> = ({ pageId, blockId, ...otherProps }) => {
  return (
    <CoreBlock pageId={pageId} blockId={blockId} {...otherProps}>
      <Suspense fallback={<LoadingState />}>
        <ThreadsFollowerCountServerUI blockId={blockId} />
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

export default ThreadsFollowerCount;
