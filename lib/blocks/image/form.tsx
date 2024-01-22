import { FormFileUpload } from '@/app/components/FormFileUpload';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { ImageBlockConfig } from './config';

const FormSchema = Yup.object().shape({
  title: Yup.string().required('Please provide a title'),
  description: Yup.string().required('Please provide a subtitle'),
  avatar: Yup.string().required('Please provide an avatar URL'),
});

interface Props {
  initialValues: ImageBlockConfig;
  onSave: (values: ImageBlockConfig) => void;
  formRef: {
    current: FormikProps<ImageBlockConfig> | null;
  };
}

export function EditForm({ initialValues, onSave, formRef }: Props) {
  const router = useRouter();
  const onSubmit = async (
    values: ImageBlockConfig,
    { setSubmitting }: FormikHelpers<ImageBlockConfig>
  ) => {
    setSubmitting(true);
    onSave(values);
  };

  const handleUploadComplete = () => {
    router.refresh();
  };

  return (
    <Formik
      initialValues={{
        src: initialValues?.src ?? '',
      }}
      validationSchema={FormSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
      innerRef={formRef}
    >
      {() => (
        <Form className="w-full flex flex-col">
          <FormFileUpload
            onUploaded={handleUploadComplete}
            initialValue={initialValues?.src}
          />
        </Form>
      )}
    </Formik>
  );
}
