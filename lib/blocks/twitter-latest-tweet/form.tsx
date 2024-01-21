import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { FormikProps } from 'formik';
import { TwitterLatestTweetBlockConfig } from './config';

interface Props {
  initialValues: TwitterLatestTweetBlockConfig;
  onSave: (values: TwitterLatestTweetBlockConfig) => void;
  formRef: {
    current: FormikProps<TwitterLatestTweetBlockConfig> | null;
  };
}

export function EditForm({ onSave }: Props) {
  return (
    <div>
      <a
        target="_blank"
        href="/api/services/twitter"
        className="inline-flex items-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        <PlusCircleIcon className="w-6 h-6 inline-block mr-1" />
        Link Twitter Account
      </a>
    </div>
  );
}
