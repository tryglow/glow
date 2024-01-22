import { FormField } from '@/app/components/FormField';
import { FieldArray, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { StackBlockConfig, StackSchema } from './config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormFileUpload } from '@/app/components/FormFileUpload';

interface Props {
  initialValues: StackBlockConfig;
  onSave: (values: StackBlockConfig) => void;
  formRef: {
    current: FormikProps<StackBlockConfig> | null;
  };
}

export function EditForm({ initialValues, onSave, formRef }: Props) {
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
      innerRef={formRef}
    >
      {({ values, setFieldValue }) => (
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
        </Form>
      )}
    </Formik>
  );
}
