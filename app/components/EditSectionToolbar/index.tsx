'use client';

import {PencilSquareIcon, TrashIcon} from '@heroicons/react/24/outline';

interface Props {
  sectionId: string;
}

export function EditSectionToolbar({sectionId}: Props) {
  return (
    <span className="isolate inline-flex rounded-md shadow-sm z-50 absolute -top-10 opacity-0 section-toolbar">
      <button
        type="button"
        className="relative inline-flex items-center rounded-l-full bg-stone-200 px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
        onClick={() => console.log('Clicked on Edit')}
      >
        <PencilSquareIcon width={20} height={20} className="text-slate-700" />
      </button>
      <button
        type="button"
        className="relative -ml-px inline-flex items-center rounded-r-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
        onClick={() => console.log('Clicked on Move')}
      >
        <TrashIcon width={20} height={20} className="text-slate-700" />
      </button>
    </span>
  );
}
