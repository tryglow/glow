import {FormField} from '@/app/components/FormField';
import {Field, Form, Formik, FormikHelpers} from 'formik';
import * as Yup from 'yup';

const FormSchema = Yup.object().shape({
  githubUsername: Yup.string().required('Please provide a GitHub username'),
});

type FormValues = {
  githubUsername: string;
};

interface Props {
  initialValues: FormValues;
  onSave: (values: FormValues) => void;
}

export function EditForm({initialValues, onSave}: Props) {
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
        githubUsername: initialValues?.githubUsername,
      }}
      validationSchema={FormSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {() => (
        <Form className="w-full flex flex-col gap-2">
          <FormField
            label="Github username"
            name="githubUsername"
            id="githubUsername"
          />

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Save
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
