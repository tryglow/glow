import { Form, Formik, FormikHelpers } from 'formik';
import { Loader2 } from 'lucide-react';

import { FormField } from '@/components/FormField';

import { Button } from '@/components/ui/button';

import { EditFormProps } from '../types';
import { AccordionBlockConfig, AccordionSchema } from './config';

export function EditForm({
  initialValues,
  onSave,
  onClose,
}: EditFormProps<AccordionBlockConfig>) {
  const onSubmit = async (
    values: AccordionBlockConfig,
    { setSubmitting }: FormikHelpers<AccordionBlockConfig>
  ) => {
    setSubmitting(true);
    onSave(values);
  };

  return (
    <Formik
      initialValues={{
        accTitle: initialValues?.accTitle ?? '',
        accContent: initialValues?.accContent ?? '',
      }}
      validationSchema={AccordionSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting, errors }) => (
        <Form className="w-full flex flex-col gap-2">
          <FormField
            label="Title"
            name="accTitle"
            id="accTitle"
            placeholder="A title"
            error={errors.accTitle}
          />
          <FormField
            label="Content"
            name="accContent"
            id="accContent"
            placeholder="Some content"
            error={errors.accContent}
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
