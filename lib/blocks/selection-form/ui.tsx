'use client';

import { FunctionComponent, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import useSWR from 'swr';

import { CoreBlock } from '@/components/CoreBlock';

import { toast } from '@/components/ui/use-toast';
import { Form, Formik, FormikHelpers } from 'formik';


import { BlockProps } from '../ui';
import { submitFeedback } from './action';
import { ItemType, SelectionFormBlockConfig, SelectionFormConfig, SelectionFormBlockSchema, SelectionFormSchema } from './config';
import { Icon } from "@iconify/react";


export const SelectionBlockForm: FunctionComponent<BlockProps> = (props) => {
  const [isOpen, setisOpen] = useState(false);
  const { data: emailListData } = useSWR<SelectionFormConfig>(
    `/api/blocks/${props.blockId}`
  );
  const { data }: any = emailListData
  
  console.log('Waitlist data => ', data);
  

  const [formSubmitted, setFormSubmitted] = useState(false);

  const onSubmit = async (formData: SelectionFormConfig) => {
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
          option: {text: '', color: ''}
        }}
        validationSchema={SelectionFormSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, values, setFieldValue, handleChange, errors }) => (
          <Form className="mt-auto flex flex-col w-full gap-2">
            <div className='relative bg-sys-bg-primary px-2 py-1.5 primary rounded-md h-9 ring-1 ring-inset ring-sys-bg-secondary/50 flex items-center justify-between cursor-pointer' onClick={() => setisOpen(prev => !prev)}>
              <p style={{backgroundColor: values?.option?.color || 'transparent'}} className={`${values?.option?.text ? 'text-black px-4' : 'text-sys-label-primary'} text-xs py-1 rounded w-max font-medium`}>{values?.option?.text || 'Select option'}</p>

              <Icon icon="dashicons:arrow-down" width="20" height="20" style={{ transform: isOpen ? 'rotate(180deg) translateX(-2px)' : 'rotate(0deg)'}} className='text-sys-label-primary' />

              {/* Select Dropdown */}
              {isOpen && <div className='waitlist-dropdown absolute bg-sys-bg-primary ring-1 ring-inset ring-sys-bg-secondary/50 rounded-md transform translate-y-2 p-3 top-full left-0 w-full flex flex-col gap-2 z-10 max-h-16 overflow-y-scroll'>
                {data?.items?.map((item: ItemType) => 
                <p 
                  key={item?.color}
                  style={{backgroundColor: item?.color}}
                  className='text-xs py-1 px-3 rounded w-max font-medium cursor-pointer text-black'
                  onClick={() => (
                    setFieldValue('option', item)
                    // setisOpen(false)
                  )} 
                >{item?.text}</p> )}
              </div> }
            </div>

            {errors?.option && <p className='text-sm text-sys-label-primary'>{errors?.option?.text}</p>}

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
