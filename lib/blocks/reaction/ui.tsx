'use client';

import { reactToResource } from '@/app/api/reactions/utils';
import { CoreBlock } from '@/app/components/CoreBlock';
import { BlockProps } from '@/lib/blocks/ui';
import { motion } from 'framer-motion';
import { FunctionComponent, useEffect, useState } from 'react';
import useSWR from 'swr';

const Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={40}
      height={40}
      viewBox="0 0 437 373"
      fill="none"
    >
      <path
        className="fill-sys-label-primary"
        d="M322.894 0C249.576 0 218.5 52.514 218.5 52.514S187.424 0 114.106 0C51.954 0 0 52.514 0 114.845 0 258.155 218.5 373 218.5 373S437 258.155 437 114.845C437 52.515 385.046 0 322.894 0Z"
      />
    </svg>
  );
};

export const Reactions: FunctionComponent<BlockProps> = (props) => {
  const { pageId, isEditable } = props;

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const [isAnimating, setIsAnimating] = useState(false);

  const [increment, setIncrement] = useState(0);

  const { data, mutate } = useSWR<{
    current: {
      [reactionType: string]: number;
    };
    total: {
      [reactionType: string]: number;
    };
  }>(`/api/reactions?pageId=${pageId}`);

  const handleClick = () => {
    if (isEditable) {
      return;
    }

    if ((data?.current.love ?? 0) + increment > 16) {
      return;
    }

    setIncrement((prev) => prev + 1);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new debounce timer
    const newTimer = setTimeout(async () => {
      try {
        await mutate(reactToResource(pageId, increment + 1));

        setIncrement(0);
      } catch (error) {
        console.error('Error liking resource:', error);
      }
    }, 1600);

    setDebounceTimer(newTimer);
  };

  useEffect(() => {
    if (isAnimating) {
      return;
    }

    if (data?.current?.love || increment > 0) {
      setIsAnimating(true);
    }
  }, [data?.current?.love, increment]);

  return (
    <CoreBlock className="relative !p-0 overflow-hidden" {...props}>
      <button
        onClick={!isEditable ? handleClick : undefined}
        className="flex items-center gap-2 py-4 px-4 group relative w-full h-full bg-sys-background-primary"
      >
        <div className="flex flex-col text-left gap-1 z-10">
          <span className="uppercase font-bold text-xs tracking-wider text-sys-label-primary">
            Love
          </span>
          <span className="text-4xl font-medium text-sys-label-primary">
            {new Intl.NumberFormat('en-US').format(
              (data?.total.love ?? 0) + increment
            )}
          </span>
        </div>
        <div className="flex-1 flex justify-center z-10">
          <Icon />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-full">
          <motion.div
            className="absolute bottom-0 left-0 right-0 w-full"
            initial={{ height: 0 }}
            animate={{
              height: isAnimating
                ? `calc(${Math.min((((data?.current?.love || 0) + increment) / 16) * 100, 100)}% + 32px)`
                : '32px',
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <svg
              width="100%"
              height={32}
              preserveAspectRatio="none"
              viewBox="0 0 1440 320"
            >
              <path
                fill="#FF6096"
                d="m0 128 26.7-5.3c26.6-5.7 80.3-15.7 133.3 0 53.3 16.3 107 58.3 160 74.6 53.3 15.7 107 5.7 160 0 53.3-5.3 107-5.3 160 10.7 53.3 16 107 48 160 48 53.3 0 107-32 160-74.7 53.3-42.3 107-96.3 160-90.6 53.3 5.3 107 69.3 160 80 53.3 10.3 107-31.7 133-53.4l27-21.3v224H0Z"
              />
            </svg>
            <div className="w-full h-full bg-gradient-to-b from-[#FF6096] to-[#FF2A76]" />
          </motion.div>
        </div>
      </button>
    </CoreBlock>
  );
};
