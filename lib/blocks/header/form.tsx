import { FormField } from '@/app/components/FormField';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { HeaderBlockConfig, HeaderSchema } from './config';

interface Props {
  initialValues: HeaderBlockConfig;
  onSave: (values: HeaderBlockConfig) => void;
  formRef: {
    current: FormikProps<HeaderBlockConfig> | null;
  };
}

export function EditForm({ initialValues, onSave, formRef }: Props) {
  const onSubmit = async (
    values: HeaderBlockConfig,
    { setSubmitting }: FormikHelpers<HeaderBlockConfig>
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
      validationSchema={HeaderSchema}
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
