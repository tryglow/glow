'use client';

import { switchTeam } from '@/app/lib/actions/team';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Team } from '@tryglow/prisma';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

interface Props {
  usersTeams?: Partial<Team>[] | null;
}

export function TeamSwitcher({ usersTeams }: Props) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const { mutate } = useSWRConfig();

  const { data: session, update: updateSession } = useSession();
  const currentTeam = usersTeams?.find(
    (team) => team.id === session?.currentTeamId
  );

  const handleSwitchTeam = async (teamId: string) => {
    if (!teamId) {
      return;
    }

    const res = await switchTeam(teamId);

    if (res?.error) {
      toast({
        title: 'Unable to switch team',
        variant: 'error',
      });
    }

    if (res?.success) {
      toast({
        title: 'Switching team…',
        variant: 'default',
      });

      router.refresh();
      updateSession();

      mutate('/pages/me');
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className="w-[70px] justify-between"
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${currentTeam?.id}.png`}
                alt={currentTeam?.id}
              />
              <AvatarFallback>
                {currentTeam?.name?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No team found.</CommandEmpty>
              {usersTeams?.map((team) => {
                return (
                  <CommandItem
                    key={team.id}
                    onSelect={() => handleSwitchTeam(team.id as string)}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${team.id}.png`}
                        alt={team.id}
                      />
                      <AvatarFallback>
                        {team?.name?.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {team.name}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        team?.id === session?.currentTeamId
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandList>
            <CommandSeparator />
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
