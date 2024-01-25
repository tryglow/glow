import { FunctionComponent, Suspense } from 'react';

import { CoreBlock } from '@/app/components/CoreBlock';

import { Skeleton } from '@/components/ui/skeleton';

import { BlockProps } from '../ui';
import { GithubCommitsThisMonthBlockConfig } from './config';
import { GithubLogo, GithubServerUI } from './ui-server';

export const GitHubCommitsThisMonth: FunctionComponent<
  BlockProps & GithubCommitsThisMonthBlockConfig
> = ({ githubUsername, ...otherProps }) => {
  return (
    <CoreBlock {...otherProps}>
      <Suspense fallback={<LoadingState />}>
        <GithubServerUI githubUsername={githubUsername} />
      </Suspense>
    </CoreBlock>
  );
};

export const LoadingState = () => {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-sys-label-secondary mb-7">
          <span className="uppercase font-bold text-xs tracking-wider">
            Commits this month
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-6" />
        </div>
      </div>
      <GithubLogo className="absolute right-6 bottom-6" />
    </div>
  );
};
