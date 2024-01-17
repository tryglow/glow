import { FormField } from '@/app/components/FormField'
import { FormFileUpload } from '@/app/components/FormFileUpload'
import { Form, Formik, FormikHelpers, FormikProps } from 'formik'
import { useRouter } from 'next/navigation'
import * as Yup from 'yup'

const FormSchema = Yup.object().shape({
  title: Yup.string().required('Please provide a title'),
  description: Yup.string().required('Please provide a subtitle'),
  avatar: Yup.string().required('Please provide an avatar URL'),
})

type FormValues = {
  src: string
}

interface Props {
  initialValues: FormValues
  onSave: (values: FormValues) => void
  formRef: {
    current: FormikProps<FormValues> | null
  }
}

export function EditForm({ initialValues, onSave, formRef }: Props) {
  const router = useRouter()
  const onSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setSubmitting(true)
    onSave(values)
  }

  const handleUploadComplete = () => {
    router.refresh()
  }

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
  )
}
