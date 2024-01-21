import { FormField } from '@/app/components/FormField';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import {
  GithubCommitsThisMonthBlockConfig,
  GithubCommitsThisMonthSchema,
} from './config';

interface Props {
  initialValues: GithubCommitsThisMonthBlockConfig;
  onSave: (values: GithubCommitsThisMonthBlockConfig) => void;
  formRef: {
    current: FormikProps<GithubCommitsThisMonthBlockConfig> | null;
  };
}

export function EditForm({ initialValues, onSave, formRef }: Props) {
  const onSubmit = async (
    values: GithubCommitsThisMonthBlockConfig,
    { setSubmitting }: FormikHelpers<GithubCommitsThisMonthBlockConfig>
  ) => {
    setSubmitting(true);
    onSave(values);
  };

  return (
    <Formik
      initialValues={{
        githubUsername: initialValues?.githubUsername,
      }}
      validationSchema={GithubCommitsThisMonthSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
      innerRef={formRef}
    >
      {() => (
        <Form className="w-full flex flex-col gap-2">
          <FormField
            label="Github username"
            name="githubUsername"
            id="githubUsername"
          />
        </Form>
      )}
    </Formik>
  );
}
