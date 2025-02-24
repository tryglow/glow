import { LoggedInAcceptInviteUI, LoggedOutAcceptInviteUI } from './accept-ui';
import { createInviteCodeHash } from './actions';
import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';
import { Avatar, AvatarFallback, AvatarImage } from '@tryglow/ui';

const getInvite = async (inviteCode: string) => {
  const invite = await prisma.teamInvite.findUnique({
    where: {
      code: inviteCode,
    },
    include: {
      team: true,
    },
  });

  return invite;
};

export default async function AcceptInvitePage(props: {
  params: Promise<{ inviteCode: string }>;
}) {
  const params = await props.params;
  const session = await auth();

  const invite = await getInvite(params.inviteCode);

  if (!invite) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4">
        <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 text-center">
          <h1 className="text-2xl font-bold mb-2">Invite not found</h1>
          <p>The invite you are trying to accept is not valid.</p>
        </div>
      </div>
    );
  }

  const inviteCodeHash = await createInviteCodeHash(invite.code);

  return (
    <div className="max-w-xl w-full mx-auto py-16 px-4">
      <div className="bg-white shadow-sm px-8 py-12 rounded-2xl border border-slate-200 text-center w-full flex flex-col items-center">
        <Avatar className="h-16 w-16 mb-4">
          <AvatarImage
            src={`https://avatar.vercel.sh/${invite?.team.id}.png`}
            alt={invite?.team.name}
          />
          <AvatarFallback>
            {invite?.team.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Join {invite?.team.name} on Glow!
        </h1>
        <p className="mb-4 max-w-md mx-auto text-pretty">
          You&apos;ve been invited to join {invite?.team.name} on Glow.
          <br />
          {session?.user
            ? 'To accept the invitation, click below.'
            : 'To accept the invitation, signup or login using one of the options below.'}
        </p>

        {session?.user ? (
          <LoggedInAcceptInviteUI inviteCode={params.inviteCode} />
        ) : (
          <LoggedOutAcceptInviteUI
            inviteCode={params.inviteCode}
            inviteCodeHash={inviteCodeHash}
          />
        )}
      </div>
    </div>
  );
}
