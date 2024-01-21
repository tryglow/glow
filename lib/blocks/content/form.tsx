import { FormField } from '@/app/components/FormField';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';

import { ContentBlockConfig, ContentSchema } from './config';

interface Props {
  initialValues: ContentBlockConfig;
  onSave: (values: ContentBlockConfig) => void;
  formRef: {
    current: FormikProps<ContentBlockConfig> | null;
  };
}

export function EditForm({ initialValues, onSave, formRef }: Props) {
  const onSubmit = async (
    values: ContentBlockConfig,
    { setSubmitting }: FormikHelpers<ContentBlockConfig>
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
      validationSchema={ContentSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
      innerRef={formRef}
    >
      {({ isSubmitting, isValid, values, setFieldValue, errors }) => (
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
