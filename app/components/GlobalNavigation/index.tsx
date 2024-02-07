'use client';

import {
  Cog6ToothIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import { Page } from '@prisma/client';
import { DesktopIcon, MobileIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { useEditModeContext } from '@/app/contexts/Edit';

import { Button } from '@/components/ui/button';

import { EditPageSettingsDialog } from '../EditPageSettingsDialog';
import { PageSwitcher } from '../PageSwitcher';
import { UserWidget } from './UserWidget';

interface Props {
  userPages: Page[] | null;
  isEditMode?: boolean;
}

export function GlobalNavigation({ userPages, isEditMode }: Props) {
  const [showEditPageSettingsDialog, setShowEditPageSettingsDialog] =
    useState(false);
  return (
    <>
      <div className="flex-col flex fixed w-full left-0 top-0 z-50">
        <div className="border-b bg-white">
          <div className="grid grid-cols-2 md:grid-cols-3 h-16 items-center px-4">
            <div className="flex items-center">
              <svg
                viewBox="0 0 224 224"
                width={20}
                fill="none"
                className="mr-3"
              >
                <path
                  fill="#999"
                  d="M222.253 222.253c-.884.884-2.437.803-3.727-.118-95.89-70.919-115.737-70.878-212.41732.901-1.06496.777-2.77423.467-4.02409-.783-1.249868-1.25-1.559625-2.959-.78309-4.024 71.7792-96.68 71.8573-116.564.90128-212.4171-.96957-1.33787-1.0021-2.84364-.11818-3.72755.88392-.88392 2.43771-.80328 3.72751.11822C101.702 73.1218 121.549 73.0805 218.229 1.30128c1.065-.776532 2.774-.466797 4.024.78307 1.25 1.24986 1.56 2.95915.783 4.02411-71.779 96.68054-71.857 116.56454-.901 212.41754.922 1.289 1.002 2.843.118 3.727Z"
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
