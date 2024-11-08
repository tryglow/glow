import Link from 'next/link';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { captureException } from '@sentry/nextjs';
import { EditFormProps } from '../types';

const SpotifyLogo = () => {
  return (
    <svg width={32} height={32} viewBox="0 0 496 512">
      <path
        fill="#1ed760"
        d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8Z"
      />
      <path d="M406.6 231.1c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3zm-31 76.2c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm-26.9 65.6c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4z" />
      <script />
    </svg>
  );
};

export function EditForm({ integration, blockId }: EditFormProps<{}>) {
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);

  const { mutate } = useSWRConfig();

  const handleDisconnect = async () => {
    if (!integration) {
      return;
    }

    try {
      const response = await fetch('/api/services/disconnect', {
        method: 'POST',
        body: JSON.stringify({
          integrationId: integration.id,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Integration disconnected',
        });

        mutate(`/api/blocks/${blockId}`);
      }
    } catch (error) {
      captureException(error);
    }
  };

  if (!integration) {
    return (
      <div className="bg-stone-100 rounded-md flex flex-col items-center text-center px-4 py-8">
        <div className="bg-stone-200 rounded-md w-14 h-14 flex items-center justify-center">
          <SpotifyLogo />
        </div>
        <span className="font-medium text-lg text-stone-800 mt-3">
          Connect your Spotify Account
        </span>
        <span className="font-normal text-stone-600 mt-1">
          To get started, you&apos;ll need to connect your Spotify account to
          your page.
        </span>

        <Button asChild className="mt-4">
          <Link
            href={`/api/services/spotify?blockId=${blockId}`}
            prefetch={false}
            target="_blank"
          >
            Connect Spotify
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-stone-100 rounded-md flex flex-col items-center text-center px-4 py-8">
      <div className="bg-stone-200 rounded-md w-14 h-14 flex items-center justify-center">
        <SpotifyLogo />
      </div>
      <span className="font-medium text-lg text-stone-800 mt-3">Connected</span>
      <span className="font-normal text-stone-600 mt-1">
        Your Spotify account was connected on{' '}
        {new Date(integration.createdAt).toLocaleDateString()}
      </span>

      {!showConfirmDisconnect && (
        <Button onClick={() => setShowConfirmDisconnect(true)} className="mt-4">
          Disconnect Account
        </Button>
      )}
      {showConfirmDisconnect && (
        <div className="flex gap-2 mt-4">
          <Button onClick={handleDisconnect}>Are you sure?</Button>
          <Button
            variant="outline"
            onClick={() => setShowConfirmDisconnect(false)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
