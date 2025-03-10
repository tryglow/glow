'use client';

import { acceptInvite } from './actions';
import { LoginForm } from '@/components/LoginForm';
import { Button, toast } from '@tryglow/ui';
import { useRouter } from 'next/navigation';

export function LoggedInAcceptInviteUI({ inviteId }: { inviteId: string }) {
  const router = useRouter();

  const handleAcceptInvite = async () => {
    const { error } = await acceptInvite(inviteId);

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

export function LoggedOutAcceptInviteUI({ inviteId }: { inviteId: string }) {
  return <LoginForm redirectTo={`/i/invite/${inviteId}/accept`} />;
}
