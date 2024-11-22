'use client';

import { FunctionComponent, useEffect, useState } from 'react';
import useSWR from 'swr';

import { CoreBlock } from '@/components/CoreBlock';

import { BlockProps } from '../ui';
import { ContentBlockConfig, loadFont, TextStyles, textStyling } from './config';
import { useEditModeContext } from '@/app/contexts/Edit';

export const Content: FunctionComponent<BlockProps> = (props) => {
  const { data } = useSWR<any>(`/api/blocks/${props.blockId}`);
  let {data: content, contentStyles: contentStyling} = data
  
  const { contentStyles, setContentStyles } = useEditModeContext();
  const [blockStyles, setBlockStyles] = useState<TextStyles>(textStyling)

  const styles = {
    blockId: props.blockId,
    ...contentStyling
  }

  console.log('contentStyles => ', contentStyles);
  
  useEffect(() => {
    setBlockStyles(styles)
    loadFont(styles?.title?.fontFamily)
    loadFont(styles?.content?.fontFamily)
  }, [contentStyling])

  useEffect(() => {
    console.log('======', contentStyles);
    setBlockStyles(contentStyles)
  }, [contentStyles])
  

  return (
    <CoreBlock {...props} blockStyles={styles} isFrameless>
      <div className="py-4 h-full overflow-hidden" 
      // style={blockStyles?.blockId === props.blockId ? blockStyles?.block : {}}
      >
        <h2 
          // className="text-2xl font-medium text-sys-label-primary"
          style={blockStyles?.blockId === props.blockId ? blockStyles?.title : styles?.title}  
        >
          {content?.title}
        </h2>
        <p 
          // className="text-lg text-sys-label-secondary"
          style={blockStyles?.blockId === props.blockId ? blockStyles?.content : styles?.content}
        >{content?.content}</p>
      </div>
    </CoreBlock>
  );
};
