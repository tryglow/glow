import { LoggedInAcceptInviteUI, LoggedOutAcceptInviteUI } from './accept-ui';
import { authClient } from '@/app/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@tryglow/ui';

const getInvite = async (inviteId: string) => {
  const invite = authClient.organization.getInvitation({
    query: {
      id: inviteId,
    },
  });

  return invite;
};

export default async function AcceptInvitePage(props: {
  params: Promise<{ inviteId: string }>;
}) {
  const params = await props.params;
  const session = await authClient.getSession();

  const invite = await getInvite(params.inviteId);

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

  return (
    <div className="max-w-xl w-full mx-auto py-16 px-4">
      <div className="bg-white shadow-sm px-8 py-12 rounded-2xl border border-slate-200 text-center w-full flex flex-col items-center">
        <Avatar className="h-16 w-16 mb-4">
          <AvatarImage
            src={`https://avatar.vercel.sh/${invite?.data?.organizationId}.png`}
            alt={invite?.data?.organizationName}
          />
          <AvatarFallback>
            {invite?.data?.organizationName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Join {invite?.data?.organizationName} on Glow!
        </h1>
        <p className="mb-4 max-w-md mx-auto text-pretty">
          You&apos;ve been invited to join {invite?.data?.organizationName} on
          Glow.
          <br />
          {session
            ? 'To accept the invitation, click below.'
            : 'To accept the invitation, signup or login using one of the options below.'}
        </p>

        {session ? (
          <LoggedInAcceptInviteUI inviteId={params.inviteId} />
        ) : (
          <LoggedOutAcceptInviteUI inviteId={params.inviteId} />
        )}
      </div>
    </div>
  );
}
