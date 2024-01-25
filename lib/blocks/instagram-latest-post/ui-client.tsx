import { FunctionComponent, Suspense } from 'react';

import { CoreBlock } from '@/app/components/CoreBlock';

import { BlockProps } from '../ui';
import { InstagramLatestPostBlockConfig } from './config';
import { InstagramLatestPostServerUI } from './ui-server';

export const InstagramLatestPost: FunctionComponent<
  BlockProps & InstagramLatestPostBlockConfig
> = ({ pageId, ...otherProps }) => {
  return (
    <CoreBlock pageId={pageId} {...otherProps} className="p-0">
      <Suspense fallback={<LoadingState />}>
        <InstagramLatestPostServerUI pageId={pageId} />
      </Suspense>
    </CoreBlock>
  );
};

export const LoadingState = () => {
  return <div>Loading</div>;
};

export default InstagramLatestPost;
