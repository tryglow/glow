'use client';

import { FunctionComponent, useEffect } from 'react';
import useSWR from 'swr';

import { CoreBlock } from '@/components/CoreBlock';

import { BlockProps } from '../ui';
import { ContentBlockConfig, loadFont } from './config';
import { useEditModeContext } from '@/app/contexts/Edit';

export const Content: FunctionComponent<BlockProps> = (props) => {
  const { data } = useSWR<any>(`/api/blocks/${props.blockId}`);
  const {data: content, contentStyles: styles} = data
  
  const { contentStyles, setContentStyles } = useEditModeContext();

  console.log('contentStyles => ', contentStyles);
  
  useEffect(() => {
    setContentStyles(styles)
    loadFont(styles?.title?.fontFamily)
    loadFont(styles?.content?.fontFamily)
  }, [styles])

  return (
    <CoreBlock {...props} isFrameless>
      <div className="py-4 h-full overflow-hidden" 
      // style={contentStyles?.blockId === props.blockId ? contentStyles?.block : {}}
      >
        <h2 
          // className="text-2xl font-medium text-sys-label-primary"
          style={contentStyles?.blockId === props.blockId ? contentStyles?.title : {}}  
        >
          {content?.title}
        </h2>
        <p 
          // className="text-lg text-sys-label-secondary"
          style={contentStyles?.blockId === props.blockId ? contentStyles?.content : {}}
        >{content?.content}</p>
      </div>
    </CoreBlock>
  );
};
