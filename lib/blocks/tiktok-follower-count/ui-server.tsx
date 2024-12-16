import { FunctionComponent } from 'react';

import Link from 'next/link';
import { fetchData } from './utils';

export const TikTokLogo = ({ fill = '#fff' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill={fill}
      viewBox="0 0 512 512"
    >
      <path d="M412.19 118.66a109.27 109.27 0 0 1-9.45-5.5 132.87 132.87 0 0 1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14 23.9 350 16 350.13 16h-82.44v318.78c0 4.28 0 8.51-.18 12.69 0 .52-.05 1-.08 1.56 0 .23 0 .47-.05.71v.18a70 70 0 0 1-35.22 55.56 68.8 68.8 0 0 1-34.11 9c-38.41 0-69.54-31.32-69.54-70s31.13-70 69.54-70a68.9 68.9 0 0 1 21.41 3.39l.1-83.94a153.14 153.14 0 0 0-118 34.52 161.79 161.79 0 0 0-35.3 43.53c-3.48 6-16.61 30.11-18.2 69.24-1 22.21 5.67 45.22 8.85 54.73v.2c2 5.6 9.75 24.71 22.38 40.82A167.53 167.53 0 0 0 115 470.66v-.2l.2.2c39.91 27.12 84.16 25.34 84.16 25.34 7.66-.31 33.32 0 62.46-13.81 32.32-15.31 50.72-38.12 50.72-38.12a158.46 158.46 0 0 0 27.64-45.93c7.46-19.61 9.95-43.13 9.95-52.53V176.49c1 .6 14.32 9.41 14.32 9.41s19.19 12.3 49.13 20.31c21.48 5.7 50.42 6.9 50.42 6.9v-81.84c-10.14 1.1-30.73-2.1-51.81-12.61Z" />
    </svg>
  );
};

export const TikTokFollowerCountServerUI: FunctionComponent<{
  pageId: string;
}> = async ({ pageId }) => {
  const data = await fetchData(pageId);
  console.log('tiktok data ===>>> ', data);
  

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-sm text-sys-label-secondary text-center">
          Edit this block to connect your TikTok account.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col @md:flex-row @md:items-center justify-between h-full">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <span className="uppercase font-bold text-xs tracking-wider text-sys-label-secondary">
            TikTok Followers
          </span>

          <span className="text-sys-label-primary text-4xl font-medium">
            {data.followerCount}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href={`https://tiktok.com/@${data.profile.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-2 items-center"
        >
          <img
            src={data.profile.avatarUrl}
            alt="Profile picture"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-lg font-medium text-sys-label-primary">
              {data.profile.displayName}
            </span>
            <span className="text-xs font-medium text-sys-label-secondary -mt-1">
              @{data.profile.username}
            </span>
          </div>
        </Link>
        <Link
          href={`https://tiktok.com/@${data.profile.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-6 right-6 @md:bottom-3 @md:right-3"
        >
          <TikTokLogo />
        </Link>
      </div>
    </div>
  );
};
