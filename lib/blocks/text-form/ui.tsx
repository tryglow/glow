'use client';

import { FunctionComponent, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import useSWR from 'swr';

import { CoreBlock } from '@/components/CoreBlock';

import { toast } from '@/components/ui/use-toast';
import { Form, Formik, FormikHelpers } from 'formik';


import { BlockProps } from '../ui';
import { submitFeedback } from './action';
import { ItemType, TextFormBlockConfig, TextFormBlockSchema, TextFormConfig, TextFormSchema } from './config';
import { Icon } from "@iconify/react";


export const TextMessageForm: FunctionComponent<BlockProps> = (props) => {
  const [isOpen, setisOpen] = useState(false);
  const { data: emailListData } = useSWR<TextFormConfig>(
    `/api/blocks/${props.blockId}`
  );
  const { data }: any = emailListData
  
  console.log('text-form props => ', props);
  

  const [formSubmitted, setFormSubmitted] = useState(false);

  const onSubmit = async (formData: TextFormConfig) => {
    if (props.isEditable) {
      toast({
        title: 'Form will not be submitted in edit mode',
        variant: 'error',
      });

      return;
    }
    
    if (!data) {
      toast({
        title: 'No data found',
        variant: 'error',
      });

      return;
    }
    
    setFormSubmitted(true);
    const waitListData = await submitFeedback(formData)

    if (waitListData) {
      toast({
        title: 'Form submitted successfully',
        variant: 'default',
      });
    }
    setFormSubmitted(false);
  };

  if (!data) return null;
  return (
    <CoreBlock {...props} className="flex flex-col">
      <h2 className="text-2xl font-medium text-sys-label-primary">
        {data?.title}
      </h2>
      <p className="text-md text-sys-label-secondary mb-6">{data?.label}</p>
      <Formik
        initialValues={{
          pageId: props.pageId,
          email: '',
          text: '',
          blockType: props?.blockType || '',
          option: {text: '', color: ''},
          isAnonymous: data?.isAnonymous
        }}
        validationSchema={TextFormSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, values, setFieldValue, handleChange, errors }) => (
          <Form className="mt-auto flex flex-col w-full gap-2">
            
            <textarea
              name='text'
              onChange={handleChange} 
              placeholder='Enter text here...'
              className='min-w-0 w-full flex-1 appearance-none rounded-md border-0 bg-sys-bg-primary px-3 py-1.5 text-base text-sys-label-primary shadow-sm ring-1 ring-inset ring-sys-bg-secondary/50 placeholder:text-gray-400 sm:w-64 sm:text-sm sm:leading-6 xl:w-full' 
              />
              {errors?.text && <p className='text-sm text-sys-label-primary'>{errors?.text}</p>}
              {!values?.isAnonymous &&
                <>
                  <p className='text-sm'>Contact email</p>
                  <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  onChange={handleChange}
                  className="min-w-0 w-full appearance-none rounded-md border-0 bg-sys-bg-primary px-3 py-1.5 text-base text-sys-label-primary shadow-sm ring-1 ring-inset ring-sys-bg-secondary/50 placeholder:text-gray-400 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
                  placeholder="youremail@example.com"
                  />
                  {errors?.email && <p className='text-sm text-sys-label-primary'>{errors?.email}</p>}
                </>
              }
            <div className="flex-shrink-0 mt-2">
              <SubmitButton
                buttonLabel={data?.buttonLabel}
                disabled={formSubmitted}
              />
            </div>
          </Form>
        )}
      </Formik>
    </CoreBlock>
  );
};

const SubmitButton = ({
  buttonLabel,
  disabled,
}: {
  buttonLabel: string;
  disabled?: boolean;
}) => {
  // const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="flex w-full items-center justify-center rounded-md bg-sys-label-primary px-3 py-2 text-sm font-semibold text-sys-bg-primary shadow-sm hover:bg-sys-label-primary/50 relative overflow-hidden"
      disabled={disabled}
    >
      {buttonLabel}
      {disabled && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/70">
          <svg
            className="animate-spin h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </button>
  );
};
