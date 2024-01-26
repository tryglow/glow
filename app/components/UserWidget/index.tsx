'use client';

import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Page } from '@prisma/client';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { EditPageSettingsDialog } from '../EditPageSettingsDialog';
import { NewPageDialog } from '../NewPageDialog';

interface Props {
  user: User;
  usersPages: Page[];
}

export function UserWidget({ user, usersPages }: Props) {
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
  const [showEditPageSettingsDialog, setShowEditPageSettingsDialog] =
    useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              {user.image && (
                <AvatarImage src={user.image} alt={user.name ?? ''} />
              )}
              <AvatarFallback>
                {user.name?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {usersPages.map((page) => {
              return (
                <DropdownMenuItem key={page.id}>
                  <Link href={`/${page.slug}`}>/{page.slug}</Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setShowEditPageSettingsDialog(true)}
            >
              <Cog6ToothIcon className="mr-2 h-5 w-5" />
              Page Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setShowNewTeamDialog(true)}>
              <PlusCircledIcon className="mr-2 h-5 w-5" />
              New Page
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <NewPageDialog
        open={showNewTeamDialog}
        onOpenChange={setShowNewTeamDialog}
        onClose={() => setShowNewTeamDialog(false)}
      />
      <EditPageSettingsDialog
        open={showEditPageSettingsDialog}
        onOpenChange={setShowEditPageSettingsDialog}
        onClose={() => setShowEditPageSettingsDialog(false)}
      />
    </>
  );
}
