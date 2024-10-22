import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import { auth } from '@/app/lib/auth';

import { acceptInvite, verifyInviteCodeHash } from '../actions';

export async function GET(
  request: NextRequest,
  { params }: { params: { inviteCode: string } }
) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const inviteCodeHash = searchParams.get('hash');

  if (!inviteCodeHash || !params.inviteCode) {
    return Response.json(
      {
        error: 'No invite code hash provided',
      },
      {
        status: 400,
      }
    );
  }

  const isValid = await verifyInviteCodeHash(params.inviteCode, inviteCodeHash);

  if (!isValid) {
    return Response.json(
      {
        error: 'Invalid invite code hash',
      },
      {
        status: 400,
      }
    );
  }

  const acceptInviteReq = await acceptInvite(params.inviteCode);

  if (acceptInviteReq.error) {
    return Response.json({ error: acceptInviteReq.error }, { status: 400 });
  }

  redirect('/');
}
