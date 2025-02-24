'use client';

import { fetchTeamMembers, fetchTeamSettings } from './actions';
import { EditTeamSettingsGeneral } from '@/components/EditTeamSettingsDialog/EditTeamSettingsGeneralForm';
import { EditTeamSettingsMembers } from '@/components/EditTeamSettingsDialog/EditTeamSettingsMembersForm';
import { Team, TeamInvite, User } from '@tryglow/prisma';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@tryglow/ui';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose: () => void;
}

export function EditTeamSettingsDialog({ open, onOpenChange, onClose }: Props) {
  const [teamSettings, setTeamSettings] = useState<Partial<Team> | null>(null);
  const [teamMembers, setTeamMembers] = useState<
    { user: Partial<User> }[] | null
  >([]);
  const [teamInvites, setTeamInvites] = useState<TeamInvite[] | null>([]);

  useEffect(() => {
    const getPageData = async () => {
      const settings = await fetchTeamSettings();
      const { members, invites } = await fetchTeamMembers();

      setTeamSettings(settings?.team ?? null);
      setTeamMembers(members);
      setTeamInvites(invites ?? null);
    };

    getPageData();
  }, []);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Team Settings</DialogTitle>
          <DialogDescription>
            Manage your team and its settings.
          </DialogDescription>
        </DialogHeader>

        {teamSettings?.isPersonal === false ? (
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="general" className="w-1/2">
                General
              </TabsTrigger>
              <TabsTrigger value="members" className="w-1/2">
                Members
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <EditTeamSettingsGeneral
                onCancel={onClose}
                initialValues={{
                  name: teamSettings?.name ?? '',
                }}
              />
            </TabsContent>
            <TabsContent value="members">
              <EditTeamSettingsMembers
                onCancel={onClose}
                members={teamMembers ?? []}
                invites={teamInvites ?? []}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <EditTeamSettingsGeneral
            onCancel={onClose}
            initialValues={{
              name: teamSettings?.name ?? '',
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
