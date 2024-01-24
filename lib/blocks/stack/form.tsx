import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import { Loader2 } from 'lucide-react';

import { FormField } from '@/app/components/FormField';
import { FormFileUpload } from '@/app/components/FormFileUpload';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { EditFormProps } from '../types';
import { StackBlockConfig, StackSchema } from './config';

export function EditForm({
  initialValues,
  onSave,
  onClose,
  blockId,
}: EditFormProps<StackBlockConfig>) {
  const onSubmit = async (
    values: StackBlockConfig,
    { setSubmitting }: FormikHelpers<StackBlockConfig>
  ) => {
    setSubmitting(true);
    onSave(values);
  };

  return (
    <Formik
      initialValues={{
        title: initialValues?.title ?? '',
        label: initialValues?.label ?? '',
        items: initialValues?.items ?? [],
      }}
      validationSchema={StackSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className="w-full flex flex-col">
          <FormField label="Title" name="title" id="title" />
          <FormField label="Label" name="label" id="label" />

          <FieldArray name="items">
            {({ push, remove }) => (
              <>
                <div className="flex flex-col space-y-2">
                  {values?.items?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-col space-y-1 bg-stone-100 border-stone-200 border rounded-lg px-3 py-3"
                      >
                        <span className="font-medium text-sm mb-3">
                          Item {index + 1}
                        </span>
                        <FormField
                          label="Title"
                          name={`items.${index}.title`}
                          id={`items.${index}.title`}
                        />
                        <FormField
                          label="URL"
                          name={`items.${index}.url`}
                          id={`items.${index}.url`}
                        />
                        <Label htmlFor={`items.${index}.image`}>Icon</Label>
                        <FormFileUpload
                          onUploaded={(val) =>
                            setFieldValue(`items.${index}.icon`, val)
                          }
                          blockId={blockId}
                        />
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => push({ title: '', url: '' })}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Add
                  </button>
                </div>
              </>
            )}
          </FieldArray>
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
