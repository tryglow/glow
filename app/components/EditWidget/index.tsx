'use client';
import {useState} from 'react';

import {Cog6ToothIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {useEditModeContext} from '@/app/contexts/Edit';
import {DraggableBlockButton} from '../DraggableBlockButton';
import {EditPageSettingsForm} from '../EditPageSettings';
import {useParams} from 'next/navigation';
import {EditForm} from '../EditForm';

export function EditWidget() {
  const [open, setOpen] = useState(true);

  const [visibleSection, setVisibleSection] = useState<
    'settings' | 'blocks' | 'drag'
  >('drag');

  const params = useParams();

  const {layout, setSelectedSectionId, selectedSectionId} =
    useEditModeContext();

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
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="z-10">
        <div className="w-96 max-h-[calc(100%_-_40px)] fixed top-5 right-5 flex rounded-2xl bg-white shadow-xl overflow-hidden">
          <div className="flex w-full h-full flex-col divide-y divide-gray-200">
            <div className="h-0 flex-1 overscroll-contain">
              <div className="bg-stone-300 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold leading-6 text-stone-900">
                    Edit Mode
                  </h2>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      className="rounded-md bg-stone-400 text-stone-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-1">
                  <p className="text-sm text-stone-700">
                    Drag and drop sections to build your page, or click on a
                    section to edit it.
                  </p>
                </div>
              </div>
              <div className="overflow-y-auto h-auto max-h-[600px]">
                {visibleSection === 'settings' && (
                  <div className="px-4 sm:px-6 pb-5 pt-6">
                    <h3 className="text-md font-bold leading-6 text-stone-900 mb-4">
                      Page Settings
                    </h3>
                    <EditPageSettingsForm />
                  </div>
                )}

                {visibleSection === 'drag' && (
                  <div className="px-4 sm:px-6 pb-5 pt-6">
                    <h3 className="text-md font-bold leading-6 text-stone-900 mb-4">
                      Blocks
                    </h3>
                    <div className="space-y-3 flex flex-col">
                      <DraggableBlockButton type="header" />
                      <DraggableBlockButton type="content" />
                      <DraggableBlockButton type="stack" />
                      <DraggableBlockButton type="github-commits-this-month" />
                    </div>
                  </div>
                )}

                {false && (
                  <div className="flex flex-1 flex-col justify-between px-4 sm:px-6 pb-5 pt-6 space-y-6">
                    <select
                      onChange={(e) => {
                        setSelectedSectionId(e.target.value);
                        setVisibleSection('blocks');
                      }}
                    >
                      <option value="" disabled defaultChecked>
                        Select a section
                      </option>
                      {layout.map((item) => (
                        <option key={item.i} value={item.i}>
                          {item.i}
                        </option>
                      ))}
                    </select>
                    {selectedSectionId && <EditForm />}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-shrink-0 justify-end px-4 py-4">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => setVisibleSection('settings')}
              >
                <Cog6ToothIcon
                  width={20}
                  height={20}
                  className="text-slate-700"
                />
                Page Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  onSaveLayout();
                }}
                className="ml-4 inline-flex justify-center rounded-full bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
