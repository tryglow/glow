'use client';

import {
  Cog6ToothIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { InviteCode, Page } from '@prisma/client';
import { DesktopIcon, MobileIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { useEditModeContext } from '@/app/contexts/Edit';

import { Button } from '@/components/ui/button';

import { AssignedInviteCodesDialog } from '../AssignedInviteCodesDialog';
import { EditPageSettingsDialog } from '../EditPageSettingsDialog';
import { PageSwitcher } from '../PageSwitcher';
import { UserWidget } from './UserWidget';

interface Props {
  userPages: Page[] | null;
  userInviteCodes?: InviteCode[] | null;
  isEditMode?: boolean;
}

export function GlobalNavigation({
  userPages,
  userInviteCodes,
  isEditMode,
}: Props) {
  const [showEditPageSettingsDialog, setShowEditPageSettingsDialog] =
    useState(false);
  const [showAssignedInviteCodesDialog, setShowAssignedInviteCodesDialog] =
    useState(false);

  return (
    <>
      <div className="flex-col flex fixed w-full left-0 top-0 z-50">
        <div className="border-b bg-white">
          <div className="grid grid-cols-2 md:grid-cols-3 h-16 items-center px-4">
            <div className="flex items-center">
              <svg
                viewBox="0 0 312 312"
                width={20}
                fill="none"
                className="mr-3"
              >
                <path
                  fill="#999"
                  d="M311.366 155.683c0 1.25-1.156 2.292-2.72 2.552-117.952 17.657-131.956 31.72-149.564 150.839-.204 1.302-1.632 2.292-3.399 2.292-1.768 0-3.195-.99-3.399-2.292C134.676 189.955 120.671 175.84 2.71935 158.235 1.08774 157.975 0 156.933 0 155.683s1.15572-2.292 2.71935-2.552C120.671 135.474 134.676 121.411 152.284 2.29176 152.488.989625 153.915 0 155.683 0c1.767 0 3.195.989625 3.399 2.29176C176.69 121.411 190.694 135.526 308.646 153.131c1.564.26 2.72 1.302 2.72 2.552Z"
                />
              </svg>

              <PageSwitcher userPages={userPages} />
              {isEditMode && (
                <nav className="flex items-center mx-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowEditPageSettingsDialog(true)}
                  >
                    <Cog6ToothIcon width={20} height={20} className="mr-2" />
                    Settings
                  </Button>
                </nav>
              )}
            </div>
            <div className="hidden md:flex justify-center">
              {isEditMode && <ScreenSizeSwitcher />}
            </div>
            <div className="flex items-center justify-end">
              {userInviteCodes && userInviteCodes?.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAssignedInviteCodesDialog(true)}
                >
                  <FireIcon width={20} className="mr-2 text-[#FF4F17]" />
                  You have {userInviteCodes.length}{' '}
                  {userInviteCodes.length === 1 ? 'Invite' : 'Invites'}!
                </Button>
              )}
              <UserWidget />
            </div>
          </div>
        </div>
      </div>
      {showEditPageSettingsDialog && (
        <EditPageSettingsDialog
          open={true}
          onOpenChange={setShowEditPageSettingsDialog}
          onClose={() => setShowEditPageSettingsDialog(false)}
        />
      )}

      {userInviteCodes && showAssignedInviteCodesDialog && (
        <AssignedInviteCodesDialog
          open={true}
          onOpenChange={setShowAssignedInviteCodesDialog}
          onClose={() => setShowAssignedInviteCodesDialog(false)}
          inviteCodes={userInviteCodes}
        />
      )}
    </>
  );
}
function ScreenSizeSwitcher() {
  const { editLayoutMode, setEditLayoutMode } = useEditModeContext();

  return (
    <div className="inline-flex w-auto h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
      <button
        type="button"
        role="tab"
        onClick={() => setEditLayoutMode('desktop')}
        aria-selected={editLayoutMode === 'desktop' ? 'true' : 'false'}
        data-state={editLayoutMode === 'desktop' ? 'active' : 'inactive'}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
      >
        <ComputerDesktopIcon width={20} />
      </button>
      <button
        type="button"
        role="tab"
        onClick={() => setEditLayoutMode('mobile')}
        aria-selected={editLayoutMode === 'mobile' ? 'true' : 'false'}
        data-state={editLayoutMode === 'mobile' ? 'active' : 'inactive'}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
      >
        <DevicePhoneMobileIcon width={20} />
      </button>
    </div>
  );
}
