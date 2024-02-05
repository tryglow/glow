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
}

export function GlobalNavigation({ userPages }: Props) {
  const [showEditPageSettingsDialog, setShowEditPageSettingsDialog] =
    useState(false);
  return (
    <>
      <div className="flex-col flex fixed w-full left-0 top-0 z-50">
        <div className="border-b bg-white">
          <div className="grid grid-cols-2 md:grid-cols-3 h-16 items-center px-4">
            <div className="flex items-center">
              <svg
                viewBox="0 0 196 240"
                width={20}
                height={20}
                fill="none"
                className="mr-3"
              >
                <path
                  fill="#999"
                  fillRule="evenodd"
                  d="M76.4539 239.092C142.477 239.092 196 185.57 196 119.546 196 53.5226 142.477 0 76.4539 0v43.0922C34.2296 43.0922.0000037 77.3217 0 119.546-.0000037 161.77 34.2296 196 76.4539 196v43.092ZM76.454 196c42.224 0 76.454-34.23 76.454-76.454 0-42.2242-34.23-76.4538-76.454-76.4538V196Z"
                  clipRule="evenodd"
                />
              </svg>
              <PageSwitcher userPages={userPages} />
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
            </div>
            <div className="hidden md:flex justify-center">
              <ScreenSizeSwitcher />
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
