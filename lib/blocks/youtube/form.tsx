import { Form, Formik, FormikHelpers } from 'formik';
import { Loader2 } from 'lucide-react';

import { FormField } from '@/components/FormField';

import { Button } from '@/components/ui/button';

import { EditFormProps } from '../types';
import { YouTubeBlockConfig, YouTubeBlockSchema } from './config';import { Icon } from "@iconify/react";

export function EditForm({
  initialValues,
  onSave,
  onClose,
}: EditFormProps<YouTubeBlockConfig>) {
  const onSubmit = async (
    values: YouTubeBlockConfig,
    { setSubmitting }: FormikHelpers<YouTubeBlockConfig>
  ) => {
    setSubmitting(true);
    onSave(values);
  };

  return (
    <Formik
      initialValues={{
        videoId: initialValues?.videoId ?? '',
      }}
      validationSchema={YouTubeBlockSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting, errors }) => (
        <Form className="w-full flex flex-col gap-2 h-96">
          <div className='flex items-center gap-1.5'>
            <label className='text-black' htmlFor="videoId">Video ID</label>
            <div className='relative info-icon'>
              <Icon icon="heroicons:question-mark-circle-20-solid" width="20" height="20" />

              <div className='youtube-info hidden absolute top-full left-0 transform -translate-x-[3.6rem] translate-y-2 w-[324px] bg-white border rounded-lg shadow-md z-50'>
                <p className='text-xl font-bold p-3 border-b'>How to find Youtube Video ID</p>
                <div className='p-3 text-black'>
                  <p className='text-sm'>The YouTube Video ID is the portion at the end of the URL after “=” . </p>
                  <img src="/assets/landing-page/video-info.png" alt="" className='py-2' />
                  <p className='text-center text-sm'>Example: This Youtube Video ID is <span className='font-bold'>“eVli-tstM5E”</span></p>
                </div>
              </div>
            </div>
          </div>
          <FormField
            label=""
            name="videoId"
            id="videoId"
            error={errors.videoId}
          />

          <div className="flex flex-shrink-0 justify-between py-4 border-t border-stone-200">
            <Button type="button" variant="secondary" onClick={onClose}>
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
  );
}
