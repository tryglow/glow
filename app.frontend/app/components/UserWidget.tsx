'use client';

import { ManageBillingDialog } from '@/app/components/ManageBillingDialog';
import { authClient, useSession } from '@/app/lib/auth';
import { EditTeamSettingsDialog } from '@/components/EditTeamSettingsDialog/EditTeamSettingsDialog';
import { NewPageDialog } from '@/components/NewPageDialog';
import { Organization } from '@tryglow/prisma';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@tryglow/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  usersOrganizations?: Partial<Organization>[] | null;
}

export function UserWidget({ usersOrganizations }: Props) {
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
  const [showTeamSettingsDialog, setShowTeamSettingsDialog] = useState(false);
  const [showManageBillingDialog, setShowManageBillingDialog] = useState(false);
  const { data: session } = useSession();

  const router = useRouter();

  const { user } = session ?? {};

  if (!user) {
    return null;
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-10 w-10 rounded-full">
            <Avatar className="h-8 w-8">
              {user.image && (
                <AvatarImage src={user.image} alt={user.name ?? ''} />
              )}
              <AvatarFallback>
                {user.name?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {usersOrganizations && usersOrganizations?.length > 1 && (
            <>
              <DropdownMenuItem onClick={() => setShowTeamSettingsDialog(true)}>
                Team settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem
            onClick={() => setShowManageBillingDialog(true)}

            // await authClient.subscription.upgrade({
            //   plan: 'team',
            //   referenceId: session?.session.activeOrganizationId,
            //   seats: 1,
            //   successUrl: '/edit',
            //   cancelUrl: '/edit',
            // });
            // TODO - Hook this up to the pricing table
            // }}
          >
            Manage Billing
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={async () => {
              await authClient.signOut();
              router.refresh();
            }}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <NewPageDialog
        open={showNewTeamDialog}
        onOpenChange={setShowNewTeamDialog}
        onClose={() => setShowNewTeamDialog(false)}
      />
      {showTeamSettingsDialog && (
        <EditTeamSettingsDialog
          open={showTeamSettingsDialog}
          onOpenChange={setShowTeamSettingsDialog}
          onClose={() => setShowTeamSettingsDialog(false)}
        />
      )}

      <ManageBillingDialog
        open={showManageBillingDialog}
        onOpenChange={setShowManageBillingDialog}
      />
    </>
  );
}
