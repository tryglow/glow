import { Form, Formik, FormikHelpers } from 'formik';
import { Loader2 } from 'lucide-react';

import { FormField } from '@/app/components/FormField';

import { Button } from '@/components/ui/button';

import { EditFormProps } from '../types';
import { LinkBoxBlockConfig, LinkBoxSchema } from './config';

export function EditForm({
  initialValues,
  onSave,
  onClose,
}: EditFormProps<LinkBoxBlockConfig>) {
  const onSubmit = async (
    values: LinkBoxBlockConfig,
    { setSubmitting }: FormikHelpers<LinkBoxBlockConfig>
  ) => {
    setSubmitting(true);
    onSave(values);
  };

  return (
    <Formik
      initialValues={{
        link: initialValues?.link,
        title: initialValues?.title,
        label: initialValues?.label,
        icon: initialValues?.icon,
      }}
      validationSchema={LinkBoxSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting }) => (
        <Form className="w-full flex flex-col gap-1">
          <FormField label="Title" name="title" id="title" />
          <FormField label="Label" name="label" id="label" />
          <FormField label="Link" name="link" id="link" />
          <FormField label="Icon" name="icon" id="icon" />
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
