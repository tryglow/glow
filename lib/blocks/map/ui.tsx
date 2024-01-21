import { FunctionComponent } from 'react';
import { CoreBlock } from '@/app/components/CoreBlock';
import { MapboxMap } from './ui-client';
import { MapBlockConfig } from './config';

const Map: FunctionComponent<MapBlockConfig> = async ({ coords }) => {
  return (
    <CoreBlock className="relative !p-0 overflow-hidden">
      <MapboxMap
        className="absolute w-full h-full object-cover"
        coords={coords}
      />
    </CoreBlock>
  );
};

export default Map;
