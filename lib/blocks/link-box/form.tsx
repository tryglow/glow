import { FormField } from '@/app/components/FormField';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';

const FormSchema = Yup.object().shape({
  title: Yup.string().required('Please provide a title'),
  label: Yup.string(),
  link: Yup.string().required('Please provide a link'),
  icon: Yup.string(),
});

type FormValues = {
  icon: string;
  link: string;
  title: string;
  label: string;
};

interface Props {
  initialValues: FormValues;
  onSave: (values: FormValues) => void;
  formRef: {
    current: FormikProps<FormValues> | null;
  };
}

export function EditForm({ initialValues, onSave, formRef }: Props) {
  const onSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
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
      validationSchema={FormSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
      innerRef={formRef}
    >
      {() => (
        <Form className="w-full flex flex-col gap-2">
          <FormField label="Title" name="title" id="title" />
          <FormField label="Label" name="label" id="label" />
          <FormField label="Link" name="link" id="link" />
          <FormField label="Icon" name="icon" id="icon" />
        </Form>
      )}
    </Formik>
  );
}
