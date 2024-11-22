import { Form, Formik, FormikHelpers } from 'formik';
import { Loader2 } from 'lucide-react';

import { FormField } from '@/components/FormField';

import { Button } from '@/components/ui/button';

import { EditFormProps } from '../types';
import { ContentBlockConfig, ContentSchema, TextStyles } from './config';
import { TextStyling } from './text-styling';
import { useEditModeContext } from '@/app/contexts/Edit';
import { useGridAngleContext } from '@/app/contexts/GridAngle';

export function EditForm({
  initialValues,
  onSave,
  onClose,
  blockId
}: EditFormProps<ContentBlockConfig>) {

  const { contentStyles, setContentStyles } = useEditModeContext()
  // const { setAngle } = useGridAngleContext()

  const onSubmit: any = async (
    values: ContentBlockConfig,
    { setSubmitting }: FormikHelpers<ContentBlockConfig>
  ) => {
    setSubmitting(true);
    onSave(values);
  };

  // const handleBlockRotation = () => {
  //   let value = contentStyles?.block?.transform?.split('(')[1];
  //   value = parseInt(value?.replace('deg)', ''))
    
  //   if (Number.isNaN(value)) value = 0
  //   setAngle((value + 90) % 360)
    
  //   setContentStyles((prev: TextStyles) => ({...prev, block: {
  //     ...prev.block, transform: `rotate(${(value + 90) % 360}deg)` 
  //   }}))
  // }

  return (
    <>
      <Formik
        initialValues={{
          title: initialValues?.title ?? '',
          content: initialValues?.content ?? '',
        }}
        validationSchema={ContentSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, errors }) => (
          <Form className="w-full flex flex-col gap-2">
            <FormField
              label="Title"
              name="title"
              id="title"
              placeholder="A title"
              error={errors.title}
            />
            <TextStyling blockId={blockId} name={'title'} />
            <FormField
              label="Content"
              name="content"
              id="content"
              placeholder="Some content"
              error={errors.content}
            />
            <TextStyling blockId={blockId} name={'content'} />

            {/* <div className='border-t py-2'>
              <p className='mb-2 text-lg font-medium'>Block</p>
              <Button type='button' onClick={handleBlockRotation}>Rotate</Button>
            </div> */}

            <div className="flex flex-shrink-0 justify-between py-4 border-t border-stone-200">
              <Button variant="secondary" onClick={onClose}>
                ← Cancel
              </Button>
              <Button type="submit">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </div>
          </Form>
        )}

      </Formik>
    </>
  );
}
