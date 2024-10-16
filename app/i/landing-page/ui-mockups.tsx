import styles from '@/lib/blocks/spotify-playing-now/styles.module.css';
import { SpotifyLogo } from '@/lib/blocks/spotify-playing-now/ui-server';
import { cn } from '@/lib/utils';

export const SpotifyPlayingNowMockup = () => {
  return (
    <div className="h-full overflow-hidden relative max-w-[624px] bg-sys-bg-primary border-sys-bg-border border p-6 rounded-3xl shadow-md bg-gradient-to-tr from-[#0A0B0D] to-[#402650]">
      <div className="flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://i.scdn.co/image/ab67616d00001e026b8a4828e057b7dc1c4a4d39"
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
          <p className="text-md text-white font-bold">ten</p>
          <p className="text-sm text-white">Fred again</p>
        </div>

        <SpotifyLogo />
      </div>
    </div>
  );
};
