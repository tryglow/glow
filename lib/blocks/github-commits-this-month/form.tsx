import { FormField } from '@/app/components/FormField'
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik'
import * as Yup from 'yup'

const FormSchema = Yup.object().shape({
  githubUsername: Yup.string().required('Please provide a GitHub username'),
})

type FormValues = {
  githubUsername: string
}

interface Props {
  initialValues: FormValues
  onSave: (values: FormValues) => void
  formRef: {
    current: FormikProps<FormValues> | null
  }
}

export function EditForm({ initialValues, onSave, formRef }: Props) {
  const onSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setSubmitting(true)
    onSave(values)
  }

  return (
    <Formik
      initialValues={{
        githubUsername: initialValues?.githubUsername,
      }}
      validationSchema={FormSchema}
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
  )
}
