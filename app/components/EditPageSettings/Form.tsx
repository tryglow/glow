import {Form, Formik, FormikHelpers} from 'formik';
import * as Yup from 'yup';
import {Switch} from '@headlessui/react';

import clsx from 'clsx';
import {useState} from 'react';

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

export default function Example() {
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
          <div className="space-y-12">
            <div className="border-b border-white/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Slug
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                      <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                        sono.am/
                      </span>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        autoComplete="username"
                        className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="james"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Meta title
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        autoComplete="username"
                        className="flex-1 border-0 bg-transparent py-1.5 px-3 text-white focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="james"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="pageMetaDescription"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Meta description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      defaultValue={''}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    Write a few sentences about yourself.
                  </p>
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
                          className="text-sm font-medium leading-6 text-white"
                          passive
                        >
                          Published
                        </Switch.Label>
                        <Switch.Description
                          as="span"
                          className="text-sm text-gray-500"
                        >
                          Disabling this will turn your page into a draft and
                          only you will be able to see it.
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
