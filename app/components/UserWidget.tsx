'use client';

import { Team } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { signOut } from '@/app/lib/auth-actions';
import { getBillingPortalLink } from '@/lib/stripe';

import { EditTeamSettingsDialog } from '@/components/EditTeamSettingsDialog/EditTeamSettingsDialog';
import { NewPageDialog } from '@/components/NewPageDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  usersTeams?: Partial<Team>[];
}

export function UserWidget({ usersTeams }: Props) {
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
  const [showTeamSettingsDialog, setShowTeamSettingsDialog] = useState(false);

  const { data: session } = useSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
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

          {usersTeams && usersTeams?.length > 1 && (
            <>
              <DropdownMenuItem onClick={() => setShowTeamSettingsDialog(true)}>
                Team settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem
            onClick={async () => {
              const billingPortalLink = await getBillingPortalLink();
              if (billingPortalLink) {
                window.open(billingPortalLink, '_blank');
              }
            }}
          >
            Manage Billing
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
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
    </>
  );
}
