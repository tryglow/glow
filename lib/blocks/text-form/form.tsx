import { Form, Formik, FormikHelpers, FieldArray, Field } from 'formik';
import { Loader2 } from 'lucide-react';

import { FormField } from '@/components/FormField';

import { Button } from '@/components/ui/button';

import { EditFormProps } from '../types';
import { ItemType, TextFormBlockConfig, TextFormBlockSchema } from './config';

const colors = ["#F4393C", "#FF4182", "#3293FB", "#20D800", "#FA5DFF", "#F9E552", "#FF7E38", "#24FBFF"]

export function EditForm({
  initialValues,
  onSave,
  onClose,
  blockId,
}: EditFormProps<TextFormBlockConfig>) {

  const onSubmit = async (
    values: TextFormBlockConfig,
    { setSubmitting }: FormikHelpers<TextFormBlockConfig>
  ) => {
    console.log('values => ', values);
    
    setSubmitting(true);
    onSave(values);
  };

  return (
    <Formik
      initialValues={{
        title: initialValues?.title ?? '',
        label: initialValues?.label ?? '',
        buttonLabel: initialValues?.buttonLabel ?? '',
        items: initialValues?.items ?? [{text: '', color: colors[0]}],
        isAnonymous: initialValues?.isAnonymous ?? true
        // waitlistId: initialValues?.waitlistId ?? '',
      }}
      validationSchema={TextFormBlockSchema}
      onSubmit={onSubmit}
      enableReinitialize={false}
    >
      {({ isSubmitting, values, handleChange, setFieldValue, errors }) => (
        <Form className="w-full flex flex-col gap-2">
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
          <FormField
            label="Button label"
            name="buttonLabel"
            id="buttonLabel"
            error={errors.buttonLabel}
          />

          <label htmlFor="is-anonymous">
          <input type="checkbox" checked={values?.isAnonymous} id='is-anonymous' name='isAnonymous' onChange={handleChange} className='mr-2 outline-none ring-0 border-none' />
            <span className='select-none'>Is it anonymous sender?</span></label>

          <div className="flex flex-shrink-0 justify-between py-4 border-t border-stone-200 mt-2">
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
