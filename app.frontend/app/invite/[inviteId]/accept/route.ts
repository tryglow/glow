import { acceptInvite } from '../actions';
import { authClient } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ inviteId: string }> }
) {
  const params = await props.params;
  const session = await authClient.getSession();

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!params.inviteId) {
    return Response.json(
      {
        error: 'No invite id provided',
      },
      {
        status: 400,
      }
    );
  }

  const acceptInviteReq = await acceptInvite(params.inviteId);

  if (acceptInviteReq.error) {
    return Response.json({ error: acceptInviteReq.error }, { status: 400 });
  }

  redirect('/');
}
