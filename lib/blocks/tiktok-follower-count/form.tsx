import Link from 'next/link';
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { InitialDataUsersIntegrations } from '@/app/[domain]/[slug]/page';

import { EditFormProps } from '@/lib/blocks/types';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { captureException } from '@sentry/nextjs';
import { TikTokLogo } from './ui-server';
import { TikTokIntegrationConfig } from './config';

export function EditForm({
  initialValues,
  onSave,
  onClose,
  blockId,
}: EditFormProps<TikTokIntegrationConfig>) {
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);
  const { data: usersIntegrations } = useSWR<InitialDataUsersIntegrations>(
    '/api/user/integrations'
  );
  // const { data: integrationBlock } = useSWR(`/api/blocks/${blockId}`);

  console.log('tiktok follower account => ', blockId);
  

  const { mutate } = useSWRConfig();

  const tiktokIntegrations = usersIntegrations?.filter(
    (integration) => integration.type === 'tiktok'
  );

  const handleDisconnect = async () => {
    if (!tiktokIntegrations || tiktokIntegrations?.length === 0) {
      return;
    }

    try {
      const response = await fetch('/api/services/disconnect', {
        method: 'POST',
        body: JSON.stringify({
          integrationId: tiktokIntegrations[0].id,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Integration disconnected',
        });

        mutate('/api/user/integrations');
      }
    } catch (error) {
      captureException(error);
      toast({
        title: 'Error disconnecting integration',
        description: 'Please try again later.',
      });
    }
  };

  if (!tiktokIntegrations || tiktokIntegrations?.length === 0) {
    return (
      <div className="bg-stone-100 rounded-md flex flex-col items-center text-center px-4 py-8">
        <div className="bg-stone-200 rounded-md w-14 h-14 flex items-center justify-center">
          <TikTokLogo />
        </div>
        <span className="font-medium text-lg text-stone-800 mt-3">
          Connect your TikTok Account
        </span>
        <span className="font-normal text-stone-600 mt-1">
          To get started, you&apos;ll need to connect your TikTok account to
          your page.
        </span>

        <Button asChild className="mt-4">
          <Link href="/api/services/tiktok" prefetch={false} target="_blank">
            Connect Tiktok
          </Link>
        </Button>
      </div>
    );
  }

  const connectedSince = tiktokIntegrations[0].createdAt;

  return (
    <>
      <div className="bg-stone-100 rounded-md flex flex-col items-center text-center px-4 py-8">
        <div className="bg-stone-200 rounded-md w-14 h-14 flex items-center justify-center">
          <TikTokLogo />
        </div>
        <span className="font-medium text-lg text-stone-800 mt-3">
          Connected
        </span>
        <span className="font-normal text-stone-600 mt-1">
          Your TikTok account was connected on{' '}
          {new Date(connectedSince).toLocaleDateString()}
        </span>

        {!showConfirmDisconnect && (
          <Button
            onClick={() => setShowConfirmDisconnect(true)}
            className="mt-4"
          >
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
    </>
  );
}
