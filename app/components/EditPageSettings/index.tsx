'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import * as Yup from 'yup';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

import { FormField } from '../FormField';

const FormSchema = Yup.object().shape({
  pageSlug: Yup.string().required('Please provide a page slug'),
  metaTitle: Yup.string().required('Please provide a page title'),
});

type FormValues = {
  pageSlug: string;
  metaTitle: string;
  published: boolean;
  themeId: string;
};

interface Props {
  onBack: () => void;
  initialValues: FormValues;
}

export function EditPageSettingsForm({ onBack, initialValues }: Props) {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, setFieldError }: FormikHelpers<FormValues>
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
          theme: values.themeId,
        }),
      });

      const res = await req.json();

      if (res?.error) {
        console.log(res.error);
        toast({
          variant: 'error',
          title: 'Something went wrong',
          description: res.error.message,
        });

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

      toast({
        title: 'Your page settings have been updated',
      });
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Something went wrong',
        description: 'Sorry, there was an issue updating your page settings',
      });
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
        themeId: initialValues.themeId,
      }}
      validationSchema={FormSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, values, setFieldValue, errors }) => (
        <Form className="w-full flex flex-col">
          <div className="overflow-y-auto h-auto max-h-[600px] bg-stone-50">
            <div className="px-4 sm:px-6 pb-5 pt-6">
              <div className="border-b border-white/10 pb-12">
                <div>
                  <FormField
                    withPrefix="oneda.sh/"
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
                  <FormField
                    label="Page theme"
                    name="themeId"
                    placeholder="Select a theme"
                    id="themeId"
                    error={errors.themeId}
                  />
                </div>

                <div className="mt-4">
                  <Label htmlFor="published">Published</Label>
                  <div className="flex flex-col">
                    <Switch
                      id="published"
                      checked={values.published}
                      onCheckedChange={(newVal) =>
                        setFieldValue('published', newVal)
                      }
                    />
                    <label className="text-sm mt-3">
                      Disabling this will turn your page into a draft and only
                      you will be able to see it.
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 justify-between px-4 py-4 border-t border-stone-200">
            <Button variant="secondary" onClick={onBack}>
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
