'use client';

import { useRouter } from 'next/navigation';

import { LoginProviderButton } from '@/app/components/LoginProviderButton';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { acceptInvite } from './actions';

export function LoggedInAcceptInviteUI({ inviteCode }: { inviteCode: string }) {
  const router = useRouter();

  const handleAcceptInvite = async () => {
    const { error } = await acceptInvite(inviteCode);

    if (error) {
      toast({
        title: 'Sorry, there was an error accepting your invite',
        description: error,
      });

      return;
    }

    router.push('/');
  };

  return <Button onClick={handleAcceptInvite}>Accept Invite</Button>;
}

export function LoggedOutAcceptInviteUI({
  inviteCode,
  inviteCodeHash,
}: {
  inviteCode: string;
  inviteCodeHash: string;
}) {
  return (
    <div className="gap-2 flex flex-col items-center justify-center md:flex-row w-full">
      <LoginProviderButton
        provider="twitter"
        className="h-9"
        shouldRedirect={true}
        redirectTo={`/i/invite/${inviteCode}/accept?hash=${inviteCodeHash}`}
      />
      <LoginProviderButton
        provider="google"
        className="h-9"
        shouldRedirect={true}
        redirectTo={`/i/invite/${inviteCode}/accept?hash=${inviteCodeHash}`}
      />
    </div>
  );
}
