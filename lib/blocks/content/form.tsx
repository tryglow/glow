import { Form, Formik, FormikHelpers } from 'formik';
import { Loader2 } from 'lucide-react';

import { FormField } from '@/components/FormField';

import { Button } from '@/components/ui/button';

import { EditFormProps } from '../types';
import { ContentBlockConfig, ContentSchema } from './config';
import { TextStyling } from './text-styling';

export function EditForm({
  initialValues,
  onSave,
  onClose,
}: EditFormProps<ContentBlockConfig>) {

  const onSubmit: any = async (
    values: ContentBlockConfig,
    { setSubmitting }: FormikHelpers<ContentBlockConfig>
  ) => {
    setSubmitting(true);
    onSave(values);
  };

  return (
    <>
      <Formik
        initialValues={{
          title: initialValues?.title ?? '',
          content: initialValues?.content ?? '',
        }}
        validationSchema={ContentSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, errors }) => (
          <Form className="w-full flex flex-col gap-2">
            <FormField
              label="Title"
              name="title"
              id="title"
              placeholder="A title"
              error={errors.title}
            />
            <TextStyling name={'title'} />
            <FormField
              label="Content"
              name="content"
              id="content"
              placeholder="Some content"
              error={errors.content}
            />
            <TextStyling name={'content'} />
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
    </>
  );
}
