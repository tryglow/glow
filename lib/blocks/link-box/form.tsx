import { Form, Formik, FormikHelpers } from 'formik';
import { Loader2 } from 'lucide-react';

import { FormField } from '@/app/components/FormField';
import { FormFileUpload } from '@/app/components/FormFileUpload';

import { Button } from '@/components/ui/button';

import { EditFormProps } from '../types';
import { LinkBoxBlockConfig, LinkBoxSchema } from './config';

export function EditForm({
  initialValues,
  onSave,
  onClose,
  blockId,
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
        icon: {
          src: initialValues?.icon?.src,
        },
      }}
      validationSchema={LinkBoxSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting, setFieldValue, errors }) => (
        <Form className="w-full flex flex-col gap-1">
          <FormField
            label="Title"
            name="title"
            id="title"
            error={errors.title}
          />
          <FormField
            label="Label"
            name="label"
            id="label"
            error={errors.label}
          />
          <FormField label="Link" name="link" id="link" error={errors.link} />
          <FormFileUpload
            onUploaded={(url) => setFieldValue('icon.src', url)}
            initialValue={initialValues?.icon?.src}
            blockId={blockId}
            label="Icon"
          />
          {errors.icon?.src && (
            <p className="mt-2 text-sm text-red-600" id={`icon-src-error`}>
              {errors.icon?.src}
            </p>
          )}
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
