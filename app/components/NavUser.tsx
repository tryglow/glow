'use client';

import { ChevronsUpDown } from 'lucide-react';

import { EditTeamSettingsDialog } from '@/app/components/EditTeamSettingsDialog/EditTeamSettingsDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { signOut } from '@/lib/auth-actions';
import { getBillingPortalLink } from '@/lib/stripe';
import { Team } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export function NavUser({ usersTeams }: { usersTeams?: Team[] }) {
  const { isMobile } = useSidebar();

  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
  const [showTeamSettingsDialog, setShowTeamSettingsDialog] = useState(false);

  const { data: session } = useSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
              >
                <Avatar className="h-8 w-8">
                  {user.image && (
                    <AvatarImage src={user.image} alt={user.name ?? ''} />
                  )}
                  <AvatarFallback>
                    {user.name?.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8">
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name ?? ''} />
                    )}
                    <AvatarFallback>
                      {user.name?.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {usersTeams && usersTeams?.length > 1 && (
                <>
                  <DropdownMenuItem
                    onClick={() => setShowTeamSettingsDialog(true)}
                  >
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

              <DropdownMenuItem onClick={() => signOut()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

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
