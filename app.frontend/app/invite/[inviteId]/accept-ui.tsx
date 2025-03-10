'use client';

import { authClient } from '@/app/lib/auth';
import { LoginForm } from '@/components/LoginForm';
import { Button, toast } from '@tryglow/ui';
import { useRouter } from 'next/navigation';

export function LoggedInAcceptInviteUI({ inviteId }: { inviteId: string }) {
  const router = useRouter();

  const handleAcceptInvite = async () => {
    const { error } = await authClient.organization.acceptInvitation({
      invitationId: inviteId,
    });

    if (error) {
      toast({
        title: 'Sorry, there was an error accepting your invite',
        description: error.message,
      });

      return;
    }

    router.push('/');
  };

  return <Button onClick={handleAcceptInvite}>Accept Invite</Button>;
}

export function LoggedOutAcceptInviteUI({ inviteId }: { inviteId: string }) {
  return (
    <LoginForm
      redirectTo={`${process.env.NEXT_PUBLIC_BASE_URL}/invite/${inviteId}`}
    />
  );
}
