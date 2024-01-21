import { FormField } from '@/app/components/FormField';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { LinkBoxBlockConfig, LinkBoxSchema } from './config';

interface Props {
  initialValues: LinkBoxBlockConfig;
  onSave: (values: LinkBoxBlockConfig) => void;
  formRef: {
    current: FormikProps<LinkBoxBlockConfig> | null;
  };
}

export function EditForm({ initialValues, onSave, formRef }: Props) {
  const onSubmit = async (
    values: LinkBoxBlockConfig,
    { setSubmitting }: FormikHelpers<LinkBoxBlockConfig>
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
      validationSchema={LinkBoxSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
      innerRef={formRef}
    >
      {() => (
        <Form className="w-full flex flex-col gap-1">
          <FormField label="Title" name="title" id="title" />
          <FormField label="Label" name="label" id="label" />
          <FormField label="Link" name="link" id="link" />
          <FormField label="Icon" name="icon" id="icon" />
        </Form>
      )}
    </Formik>
  );
}
