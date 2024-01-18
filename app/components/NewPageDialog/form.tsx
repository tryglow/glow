'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import { FormField } from '../FormField';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';

const FormSchema = Yup.object().shape({
  pageSlug: Yup.string().required('Please provide a page slug'),
});

type FormValues = {
  pageSlug: string;
};

interface Props {
  onCancel: () => void;
}

export function CreatePageForm({ onCancel }: Props) {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, setFieldError }: FormikHelpers<FormValues>
  ) => {
    setSubmitting(true);

    try {
      const req = await fetch('/api/page/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: values.pageSlug,
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

      if (req.ok && res.data) {
        router.push(`/${res.data.page.slug}`);
        onCancel();
      }

      toast({
        title: 'Page created',
      });
    } catch (error) {
      console.log(error);
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
        pageSlug: '',
      }}
      validationSchema={FormSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, values, setFieldValue, errors }) => (
        <Form className="w-full flex flex-col">
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
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={onCancel}>
              ← Cancel
            </Button>
            <Button type="submit">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Page
            </Button>
          </DialogFooter>
        </Form>
      )}
    </Formik>
  );
}
