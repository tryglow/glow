'use client';

import {useState} from 'react';

import {
  CheckIcon,
  Cog6ToothIcon,
  PencilIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import {useParams} from 'next/navigation';
import {useEditModeContext} from '../../contexts/Edit';
import SettingsSidebar from '../SettingsSidebar';
import EditPageSettingsDialog from '../EditPageSettings';

export default function EditToolbar() {
  const [isEditPageSettingsOpen, setIsEditPageSettingsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const params = useParams();

  const {
    isEditingEnabled,
    toggleEditingEnabled,
    isResizingEnabled,
    toggleResizingEnabled,
    layout,
  } = useEditModeContext();

  const onSaveLayout = async () => {
    const newLayout = layout.map((item) => {
      return {
        w: item.w,
        h: item.h,
        x: item.x,
        y: item.y,
        i: item.i,
      };
    });

    try {
      const req = await fetch('/api/page/config/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageSlug: params.slug,
          newLayout: newLayout,
        }),
      });

      const data = await req.json();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEnableAddingSections = async () => {
    toggleResizingEnabled(true);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed top-4 right-4 pointer-events-auto flex divide-x divide-slate-400/20 overflow-hidden rounded-full bg-white text-[0.8125rem] font-medium leading-5 text-slate-700 shadow-md ring-1 ring-slate-700/10">
        <button
          onClick={handleEnableAddingSections}
          className="px-4 py-2 hover:bg-slate-50 hover:text-slate-900"
        >
          <PlusCircleIcon width={20} height={20} className="text-slate-700" />
        </button>

        <button
          className="px-4 py-2 hover:bg-slate-50 hover:text-slate-900"
          onClick={() => {
            toggleEditingEnabled(true);
            toggleResizingEnabled(true);
          }}
        >
          <PencilIcon width={20} height={20} className="text-slate-700" />
        </button>

        <button
          className="px-4 py-2 hover:bg-slate-50 hover:text-slate-900"
          onClick={() => {
            onSaveLayout();
          }}
        >
          <CheckIcon width={20} height={20} className="text-slate-700" />
        </button>
        <button
          className="px-4 py-2 hover:bg-slate-50 hover:text-slate-900"
          onClick={() => setIsEditPageSettingsOpen(true)}
        >
          <Cog6ToothIcon width={20} height={20} className="text-slate-700" />
        </button>
      </div>
      <EditPageSettingsDialog
        isOpen={isEditPageSettingsOpen}
        onClose={() => setIsEditPageSettingsOpen(false)}
      />
      <SettingsSidebar />
    </>
  );
}
