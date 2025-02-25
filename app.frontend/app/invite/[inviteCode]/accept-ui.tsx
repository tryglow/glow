'use client';

import { acceptInvite } from './actions';
import { LoginForm } from '@/app/components/LoginForm';
import { Button, toast } from '@tryglow/ui';
import { useRouter } from 'next/navigation';

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
    <LoginForm
      redirectTo={`/i/invite/${inviteCode}/accept?hash=${inviteCodeHash}`}
    />
  );
}
