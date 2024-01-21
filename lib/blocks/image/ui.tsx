import { CoreBlock } from '@/app/components/CoreBlock';
import { FunctionComponent } from 'react';
import { ImageBlockConfig } from './types';

export const Image: FunctionComponent<ImageBlockConfig> = ({ src }) => {
  return (
    <CoreBlock className="relative !p-0 overflow-hidden">
      <img src={src} className="absolute w-full h-full object-cover" />
    </CoreBlock>
  );
};
