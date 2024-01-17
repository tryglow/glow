'use client';

import {Form, Formik, FormikHelpers} from 'formik';
import * as Yup from 'yup';
import {Switch} from '@headlessui/react';

import clsx from 'clsx';

import {FormField} from '../FormField';
import toast from 'react-hot-toast';
import {Button} from '../Button';
import {useParams, useRouter} from 'next/navigation';

const FormSchema = Yup.object().shape({
  pageSlug: Yup.string().required('Please provide a page slug'),
  metaTitle: Yup.string().required('Please provide a page title'),
});

type FormValues = {
  pageSlug: string;
  metaTitle: string;
  published: boolean;
};

interface Props {
  onBack: () => void;
  initialValues: FormValues;
}

export function EditPageSettingsForm({onBack, initialValues}: Props) {
  const params = useParams();
  const router = useRouter();
  const onSubmit = async (
    values: FormValues,
    {setSubmitting, setFieldError}: FormikHelpers<FormValues>
  ) => {
    setSubmitting(true);

    try {
      const req = await fetch('/api/page/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageSlug: values.pageSlug,
          metaTitle: values.metaTitle,
          published: values.published,
          currentPageSlug: params.slug,
        }),
      });

      const res = await req.json();

      if (res?.error) {
        console.log(res.error);
        toast.error(res.error.message);
        if (res.error.field) {
          setFieldError(res.error.field, res.error.message);
        }
        return;
      }

      if (req.ok) {
        if (values.pageSlug !== params.slug) {
          router.push(`/${values.pageSlug}`);
        }
      }

      toast.success('Your page settings have been updated');
    } catch (error) {
      toast.error('Sorry, there was an issue updating your page settings');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        pageSlug: initialValues.pageSlug,
        metaTitle: initialValues.metaTitle,
        published: initialValues.published,
      }}
      validationSchema={FormSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({isSubmitting, values, setFieldValue, errors}) => (
        <Form className="w-full flex flex-col">
          <div className="overflow-y-auto h-auto max-h-[600px] bg-stone-50">
            <div className="px-4 sm:px-6 pb-5 pt-6">
              <div className="border-b border-white/10 pb-12">
                <div>
                  <FormField
                    withPrefix="unda.sh/"
                    label="Slug"
                    name="pageSlug"
                    placeholder="your-page"
                    id="pageSlug"
                    error={errors.pageSlug}
                  />
                </div>
                <div className="mt-4">
                  <FormField
                    label="Page title"
                    name="metaTitle"
                    placeholder="Hello world"
                    id="metaTitle"
                    error={errors.metaTitle}
                  />
                </div>

                <div className="mt-4">
                  <Switch.Group
                    as="div"
                    className="flex items-center justify-between"
                  >
                    <span className="flex flex-grow flex-col">
                      <Switch.Label
                        as="span"
                        className="text-sm font-medium leading-6 text-stone-900"
                        passive
                      >
                        Published
                      </Switch.Label>
                      <Switch.Description
                        as="span"
                        className="text-sm text-stone-500"
                      >
                        Disabling this will turn your page into a draft and only
                        you will be able to see it.
                      </Switch.Description>
                    </span>
                    <Switch
                      checked={values.published}
                      onChange={(ev) => setFieldValue('published', ev)}
                      className={clsx(
                        values.published ? 'bg-stone-900' : 'bg-stone-300',
                        'relative inline-flex ml-4 h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={clsx(
                          values.published ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        )}
                      />
                    </Switch>
                  </Switch.Group>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 justify-between px-4 py-4 border-t border-stone-200">
            <Button label="← Cancel" variant="secondary" onClick={onBack} />
            <Button
              label="Save"
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
