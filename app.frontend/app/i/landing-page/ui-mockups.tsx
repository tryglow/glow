/* eslint-disable @next/next/no-img-element */
import styles from '@/lib/blocks/spotify-playing-now/styles.module.css';
import { SpotifyLogo } from '@/lib/blocks/spotify-playing-now/ui-server';
import { cn } from '@tryglow/ui';

const CoreBlockMock = ({
  isFrameless,
  children,
  className,
}: {
  isFrameless?: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'h-full overflow-hidden relative max-w-[624px]',
        !isFrameless &&
          'bg-sys-bg-primary border-sys-bg-border border p-6 rounded-[1.3rem] shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
};

const mockSpotifyData: Record<
  'fredAgain' | 'kites',
  { name: string; artist: string; image: string }
> = {
  fredAgain: {
    name: 'ten',
    artist: 'Fred again',
    image: 'https://i.scdn.co/image/ab67616d00001e026b8a4828e057b7dc1c4a4d39',
  },
  kites: {
    name: 'Drunk in Japan',
    artist: 'The Kites',
    image: 'https://i.scdn.co/image/ab67616d00001e026b93f0e378afb5a40b419b34',
  },
};

export const SpotifyPlayingNowMockup = ({
  className,
  variant = 'fredAgain',
}: {
  className?: string;
  variant?: 'fredAgain' | 'kites';
}) => {
  const data = mockSpotifyData[variant];
  return (
    <CoreBlockMock
      className={cn('bg-gradient-to-tr from-[#0A0B0D] to-[#402650]', className)}
    >
      <div className="flex gap-3">
        <img
          src={data.image}
          className="w-16 h-16 object-cover rounded-lg"
          alt=""
        />

        <div className="flex flex-col justify-center">
          <p className="text-xs text-white/60 uppercase font-bold">
            <span className={cn(styles.bars, styles.animate)}>
              <span />
              <span />
              <span />
            </span>
            Playing Now
          </p>
          <p className="text-md text-white font-bold">{data.name}</p>
          <p className="text-sm text-white">{data.artist}</p>
        </div>

        <SpotifyLogo />
      </div>
    </CoreBlockMock>
  );
};

export const GithubCommitsThisMonthMockup = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <CoreBlockMock className={className}>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sys-label-secondary mb-7">
            <span className="uppercase font-bold text-xs tracking-wider">
              Commits this month
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sys-label-primary text-4xl font-medium">
              485
            </span>

            <span
              className={cn('text-sys-label-positive', 'text-xl font-medium')}
            >
              16%
            </span>
          </div>
        </div>
        <svg
          viewBox="0 0 98 96"
          width={24}
          height={24}
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-6 bottom-6 text-sys-label-primary"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
            fill="currentColor"
          />
        </svg>
      </div>
    </CoreBlockMock>
  );
};

export const InstagramLatestPostMockup = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <CoreBlockMock className={cn('!p-0', className)}>
      <div className="w-full h-full overflow-x-auto snap-x snap-mandatory">
        <div className="w-auto h-full flex flex-row gap-3">
          <div className="w-full flex-shrink-0 relative snap-center">
            <img
              src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="absolute w-full h-full object-cover"
            />

            <div className="absolute h-32 w-full bg-gradient-to-b from-transparent to-black bottom-0 z-10 px-6 py-6 flex flex-row justify-between items-end">
              <span className="flex flex-col">
                <span className="text-white font-bold text-base">
                  @getglowapp
                </span>
                <span className="text-white/70 text-sm">
                  Posted about 2 days ago
                </span>
              </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </CoreBlockMock>
  );
};

export const StackMockup = ({ className }: { className?: string }) => {
  const items = [
    {
      title: 'Figma',
      label: 'Design',
      icon: {
        src: 'https://cdn.glow.as/default-data/figma.jpeg',
      },
    },
    {
      title: 'Warp',
      label: 'Engineering',
      icon: {
        src: 'https://cdn.glow.as/default-data/warp.png',
      },
    },
  ];

  return (
    <CoreBlockMock className={cn('bg-[#1c1917]', className)}>
      <h2 className="text-2xl font-medium text-white">Tools</h2>
      <p className="text-md text-white/80">My daily drivers</p>

      <div className="flex flex-col gap-6 mt-6">
        {items?.map((item) => {
          return (
            <div key={item.title} className="flex items-center gap-4">
              <img
                src={item.icon.src}
                alt=""
                className="w-10 h-10 rounded-md"
              />
              <div className="flex flex-col">
                <h3 className="font-medium text-white text-lg mb-0">
                  {item.title}
                </h3>
                <p className="text-white/80 -mt-1">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </CoreBlockMock>
  );
};

export const ImageMockup = ({ className }: { className?: string }) => {
  return (
    <CoreBlockMock className={cn('relative !p-0 overflow-hidden', className)}>
      <img
        src="https://cdn.glow.as/block-610e4b68-f485-4730-b374-8c69fcec6928/8fca8b36-3f2d-48be-9519-5bb566044cbb"
        className="absolute w-full h-full object-cover"
        alt=""
      />
    </CoreBlockMock>
  );
};

type LinkBoxVariant = 'x' | 'instagram' | 'linkedin';

export const LinkBoxMockup = ({
  className,
  variant,
}: {
  className?: string;
  variant: LinkBoxVariant;
}) => {
  const variantData: Record<
    LinkBoxVariant,
    {
      icon: string;
      title: string;
      username: string;
    }
  > = {
    x: {
      icon: 'https://cdn.glow.as/default-data/x-logo.png',
      title: 'X / Twitter',
      username: '@tryglow',
    },
    instagram: {
      icon: 'https://cdn.glow.as/default-data/icons/instagram.svg',
      title: 'Instagram',
      username: '@getglowapp',
    },
    linkedin: {
      icon: 'https://cdn.glow.as/default-data/icons/linkedin.svg',
      title: 'LinkedIn',
      username: '@getglowapp',
    },
  };
  return (
    <CoreBlockMock className={cn('items-center flex py-3 px-5', className)}>
      <div className="flex flex-row gap-4 items-center">
        <img
          src={variantData[variant].icon}
          className="w-10 h-10 rounded-md"
          alt=""
        />
        <div className="flex flex-col">
          <span className="font-semibold text-base text-sys-label-primary">
            {variantData[variant].title}
          </span>

          <span className="text-sys-label-secondary text-xs">
            {variantData[variant].username}
          </span>
        </div>
      </div>
    </CoreBlockMock>
  );
};
