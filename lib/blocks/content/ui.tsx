'use client';

import { FunctionComponent } from 'react';

import { CoreBlock } from '@/components/CoreBlock';

import { BlockProps } from '../ui';
import { ContentBlockConfig } from './config';

export const Content: FunctionComponent<BlockProps & ContentBlockConfig> = ({
  title,
  content,
  ...otherProps
}) => {
  return (
    <CoreBlock {...otherProps} isFrameless>
      <div className="py-4 h-full overflow-hidden">
        <h2 className="text-2xl font-medium text-sys-label-primary">{title}</h2>
        <p className="text-lg text-sys-label-secondary">{content}</p>
      </div>
    </CoreBlock>
  );
};
