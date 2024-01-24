import { PlusCircleIcon } from '@heroicons/react/24/outline';

import { EditFormProps } from '../types';

export function EditForm({}: EditFormProps<{}>) {
  return (
    <div>
      <a
        target="_blank"
        href="/api/services/spotify"
        className="inline-flex items-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        <PlusCircleIcon className="w-6 h-6 inline-block mr-1" />
        Link Spotify Account
      </a>
    </div>
  );
}
