'use client';
import {Form, Formik, FormikHelpers} from 'formik';
import * as Yup from 'yup';
import {Switch} from '@headlessui/react';

import clsx from 'clsx';
import {useState} from 'react';
import {FormField} from '../FormField';

const FormSchema = Yup.object().shape({
  pageSlug: Yup.string().required('Please provide a page slug'),
  pageTitle: Yup.string().required('Please provide a page title'),
  pageMetaDescription: Yup.string().max(
    160,
    'Page description should be less than 160 characters'
  ),
});

type FormValues = {
  pageSlug: string;
  pageTitle: string;
  pageMetaDescription: string;
};

export function EditPageSettingsForm() {
  const [enabled, setEnabled] = useState(false);

  const onSubmit = async (
    values: FormValues,
    {setSubmitting}: FormikHelpers<FormValues>
  ) => {
    setSubmitting(true);
    console.log('VALUES', values);
  };

  return (
    <Formik
      initialValues={{pageSlug: '', pageTitle: '', pageMetaDescription: ''}}
      validationSchema={FormSchema}
      onSubmit={onSubmit}
    >
      {({isSubmitting, isValid, values, setFieldValue, errors}) => (
        <Form className="w-full flex flex-col gap-2">
          <div className="border-b border-white/10 pb-12">
            <div className="mt-2">
              <FormField
                label="Slug"
                name="pageSlug"
                placeholder="james"
                id="pageSlug"
              />
            </div>
            <div className="mt-2">
              <FormField
                label="Meta title"
                name="metaTitle"
                placeholder="Hello world"
                id="metaTitle"
              />
            </div>

            <div className="col-span-full">
              <div className="mt-2">
                <Switch.Group
                  as="div"
                  className="flex items-center justify-between"
                >
                  <span className="flex flex-grow flex-col">
                    <Switch.Label
                      as="span"
                      className="text-sm font-bold leading-6 text-stone-700"
                      passive
                    >
                      Published
                    </Switch.Label>
                    <Switch.Description
                      as="span"
                      className="text-sm text-gray-500"
                    >
                      Disabling this will turn your page into a draft and only
                      you will be able to see it.
                    </Switch.Description>
                  </span>
                  <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className={clsx(
                      enabled ? 'bg-indigo-600' : 'bg-slate-600',
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={clsx(
                        enabled ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                      )}
                    />
                  </Switch>
                </Switch.Group>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Save
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
