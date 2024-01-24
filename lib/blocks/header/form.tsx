import { Form, Formik, FormikHelpers } from 'formik';
import { Loader2 } from 'lucide-react';

import { FormField } from '@/app/components/FormField';
import { FormFileUpload } from '@/app/components/FormFileUpload';

import { Button } from '@/components/ui/button';

import { EditFormProps } from '../types';
import { HeaderBlockConfig, HeaderSchema } from './config';

export function EditForm({
  initialValues,
  onSave,
  onClose,
  blockId,
}: EditFormProps<HeaderBlockConfig>) {
  const onSubmit = async (
    values: HeaderBlockConfig,
    { setSubmitting }: FormikHelpers<HeaderBlockConfig>
  ) => {
    setSubmitting(true);
    onSave(values);
  };

  return (
    <Formik
      initialValues={{
        title: initialValues?.title ?? '',
        description: initialValues?.description ?? '',
        avatar: {
          src: initialValues?.avatar?.src ?? '',
        },
      }}
      validationSchema={HeaderSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting, setFieldValue, errors }) => (
        <Form className="w-full flex flex-col">
          <FormField
            label="Title"
            name="title"
            id="title"
            error={errors.title}
          />
          <FormField
            label="Subtitle"
            name="description"
            id="description"
            error={errors.description}
          />

          <FormFileUpload
            onUploaded={(url) => setFieldValue('avatar.src', url)}
            initialValue={initialValues?.avatar?.src}
            blockId={blockId}
          />

          <div className="flex flex-shrink-0 justify-between py-4 border-t border-stone-200">
            <Button type="button" variant="secondary" onClick={onClose}>
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
