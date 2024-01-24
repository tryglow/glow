import { Form, Formik, FormikHelpers } from 'formik';
import { Loader2 } from 'lucide-react';

import { FormField } from '@/app/components/FormField';

import { Button } from '@/components/ui/button';

import { EditFormProps } from '../types';
import {
  GithubCommitsThisMonthBlockConfig,
  GithubCommitsThisMonthSchema,
} from './config';

export function EditForm({
  initialValues,
  onSave,
  onClose,
}: EditFormProps<GithubCommitsThisMonthBlockConfig>) {
  const onSubmit = async (
    values: GithubCommitsThisMonthBlockConfig,
    { setSubmitting }: FormikHelpers<GithubCommitsThisMonthBlockConfig>
  ) => {
    setSubmitting(true);
    onSave(values);
  };

  return (
    <Formik
      initialValues={{
        githubUsername: initialValues?.githubUsername,
      }}
      validationSchema={GithubCommitsThisMonthSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting }) => (
        <Form className="w-full flex flex-col gap-2">
          <FormField
            label="Github username"
            name="githubUsername"
            id="githubUsername"
          />
          <div className="flex flex-shrink-0 justify-between py-4 border-t border-stone-200">
            <Button variant="secondary" onClick={onClose}>
              ← Cancel
            </Button>
            <Button type="submit">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
