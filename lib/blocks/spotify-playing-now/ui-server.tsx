import clsx from 'clsx';
import { FunctionComponent } from 'react';

import styles from './styles.module.css';
import { fetchData } from './utils';

interface Props {
  pageId: string;
}

export const SpotifyPlayingNowServerUI: FunctionComponent<Props> = async ({
  pageId,
}) => {
  const data = await fetchData(pageId);

  return (
    <div className="flex gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data?.imageUrl}
        className="w-16 h-16 object-cover rounded-xl"
        alt=""
      />

      <div className="flex flex-col justify-center">
        <p className="text-sm text-system-bg-primary uppercase font-bold">
          <span
            className={clsx(styles.bars, data?.isPlayingNow && styles.animate)}
          >
            <span />
            <span />
            <span />
          </span>
          {data?.isPlayingNow ? 'Playing Now' : 'Recently Played'}
        </p>
        <p className="text-md text-white font-bold">{data?.name}</p>
        <p className="text-sm text-white">{data?.artistName}</p>
      </div>
    </div>
  );
};
