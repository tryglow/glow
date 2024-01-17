import {FormField} from '@/app/components/FormField';
import {Field, Form, Formik, FormikHelpers, FormikProps} from 'formik';
import * as Yup from 'yup';

const FormSchema = Yup.object().shape({
  title: Yup.string().required('Please provide a title'),
  description: Yup.string().required('Please provide a subtitle'),
  avatar: Yup.string().required('Please provide an avatar URL'),
});

type FormValues = {
  title: string;
  description: string;
  avatar: {
    src: string;
  };
};

interface Props {
  initialValues: FormValues;
  onSave: (values: FormValues) => void;
  formRef: {
    current: FormikProps<FormValues> | null;
  };
}

export function EditForm({initialValues, onSave, formRef}: Props) {
  const onSubmit = async (
    values: FormValues,
    {setSubmitting}: FormikHelpers<FormValues>
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
      validationSchema={FormSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
      innerRef={formRef}
    >
      {() => (
        <Form className="w-full flex flex-col">
          <FormField label="Title" name="title" id="title" />
          <FormField label="Subtitle" name="description" id="description" />
          <FormField label="Avatar URL" name="avatar.src" id="avatar.src" />
        </Form>
      )}
    </Formik>
  );
}
