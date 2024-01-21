import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { FormikProps } from 'formik';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { InstagramLatestPostBlockConfig } from './config';

interface Props {
  initialValues: InstagramLatestPostBlockConfig;
  onSave: (values: InstagramLatestPostBlockConfig) => void;
  formRef: {
    current: FormikProps<InstagramLatestPostBlockConfig> | null;
  };
}

export function EditForm(props: Props) {
  return (
    <div className="flex justify-center">
      <Button asChild>
        <Link target="_blank" href="/api/services/instagram">
          <PlusCircleIcon className="w-6 h-6 inline-block mr-1" />
          Link Instagram Account
        </Link>
      </Button>
    </div>
  );
}
