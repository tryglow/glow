'use client';

import { authClient } from '@/app/lib/auth';
import { EditTeamSettingsGeneral } from '@/components/EditTeamSettingsDialog/EditTeamSettingsGeneralForm';
import { EditTeamSettingsMembers } from '@/components/EditTeamSettingsDialog/EditTeamSettingsMembersForm';
import { Invitation, Organization, User } from '@tryglow/prisma';
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
  const [teamSettings, setTeamSettings] =
    useState<Partial<Organization> | null>(null);
  const [teamMembers, setTeamMembers] = useState<
    { user: Partial<User> }[] | null
  >([]);
  const [teamInvites, setTeamInvites] = useState<Partial<Invitation>[] | null>(
    []
  );

  useEffect(() => {
    const getPageData = async () => {
      const org = await authClient.organization.getFullOrganization();

      setTeamSettings(org.data ?? null);
      setTeamMembers(org.data?.members ?? []);
      setTeamInvites(org.data?.invitations ?? []);
    };

    getPageData();
  }, []);

  const teamMetaData = JSON.parse(teamSettings?.metadata ?? '{}');

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
