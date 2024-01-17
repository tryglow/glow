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
        <Form className="w-full flex flex-col gap-2">
          <div className="sm:col-span-4 space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Title
              </label>
              <div className="mt-2">
                <Field
                  type="text"
                  name="title"
                  id="title"
                  className="block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="A title"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Content
              </label>
              <div className="mt-2">
                <Field
                  type="text"
                  name="content"
                  id="content"
                  className="block px-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Some content"
                />
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
