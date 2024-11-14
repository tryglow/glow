'use client';

import { FunctionComponent, useEffect } from 'react';
import useSWR from 'swr';

import { CoreBlock } from '@/components/CoreBlock';

import { BlockProps } from '../ui';
import { ContentBlockConfig } from './config';
import { useEditModeContext } from '@/app/contexts/Edit';

export const Content: FunctionComponent<BlockProps> = (props) => {
  const { data } = useSWR<any>(`/api/blocks/${props.blockId}`);
  const {data: content, contentStyles: styles} = data
  console.log('content styles => ', content, styles);
  

  const { contentStyles, setContentStyles } = useEditModeContext();

  console.log('contentStyles => ', content, styles);
  
  useEffect(() => {
    setContentStyles(styles)
  }, [styles])

  return (
    <CoreBlock {...props} isFrameless>
      <div className="py-4 h-full overflow-hidden">
        <h2 
          className="text-2xl font-medium text-sys-label-primary"
          style={contentStyles?.title}  
        >
          {content?.title}
        </h2>
        <p 
          className="text-lg text-sys-label-secondary"
          style={contentStyles?.content}
        >{content?.content}</p>
      </div>
    </CoreBlock>
  );
};
