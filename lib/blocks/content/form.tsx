import {FormField} from '@/app/components/FormField';
import {Field, Form, Formik, FormikHelpers, FormikProps} from 'formik';
import * as Yup from 'yup';

const FormSchema = Yup.object().shape({
  pageSlug: Yup.string(),
  content: Yup.string().required('Please provide some content'),
});

type FormValues = {
  title: string;
  content: string;
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
        content: initialValues?.content ?? '',
      }}
      validationSchema={FormSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
      innerRef={formRef}
    >
      {({isSubmitting, isValid, values, setFieldValue, errors}) => (
        <Form className="w-full flex flex-col">
          <FormField
            label="Title"
            name="title"
            id="title"
            placeholder="A title"
          />
          <FormField
            label="Content"
            name="content"
            id="content"
            placeholder="Some content"
          />
        </Form>
      )}
    </Formik>
  );
}
