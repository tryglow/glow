'use client';

import { FormField } from './FormField';
import { PageThemePreview } from '@/app/components/PageThemePreview';
import { InternalApi } from '@/app/lib/api';
import { regexSlug } from '@/lib/slugs';
import { defaultThemeSeeds } from '@/lib/theme';
import { captureException } from '@sentry/nextjs';
import {
  Button,
  DialogFooter,
  Label,
  RadioGroup,
  RadioGroupItem,
  useToast,
} from '@tryglow/ui';
import { Form, Formik, FormikHelpers } from 'formik';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

const FormSchema = Yup.object().shape({
  pageSlug: Yup.string()
    .trim()
    .required('Please provide a page slug')
    .matches(
      regexSlug,
      'Please only use lowercase letters, numbers, dashes and underscores'
    ),
  themeId: Yup.string(),
});

type FormValues = {
  pageSlug: string;
  themeId: string;
};

interface Props {
  onCancel?: () => void;
}

export function CreatePageForm({ onCancel }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, setFieldError }: FormikHelpers<FormValues>
  ) => {
    setSubmitting(true);

    try {
      const { error, slug } = await InternalApi.post('/pages', {
        slug: values.pageSlug,
        themeId: values.themeId,
      });

      if (error) {
        toast({
          variant: 'error',
          title: error.message,
          description: error.label,
        });

        if (error.field) {
          setFieldError(error.field, error.message);
        }
        return;
      }

      if (slug) {
        router.push(`/${slug}`);
        if (onCancel) {
          onCancel();
        }
      }

      toast({
        title: 'Page created',
      });
    } catch (error) {
      captureException(error);
      toast({
        variant: 'error',
        title: "We couldn't create your page",
        description: 'Sorry, this is on us, please try again later.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        pageSlug: '',
        themeId: defaultThemeSeeds.Default.id,
      }}
      validationSchema={FormSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, values, errors, touched, setFieldValue }) => {
        return (
          <Form className="w-full flex flex-col">
            <div className="border-b border-white/10 pb-12">
              <div>
                <FormField
                  withPrefix="glow.as/"
                  label="Handle"
                  name="pageSlug"
                  placeholder="your-page"
                  id="pageSlug"
                  error={
                    touched.pageSlug && values.pageSlug !== ''
                      ? errors.pageSlug
                      : undefined
                  }
                />
              </div>

              <div className="mt-4">
                <Label>Select a theme</Label>
                <RadioGroup
                  onValueChange={(val) => setFieldValue('themeId', val)}
                  defaultValue={values.themeId}
                  className="grid max-w-md grid-cols-2 gap-4 pt-2"
                >
                  {Object.entries(defaultThemeSeeds).map(
                    ([themeName, themeValues]) => {
                      return (
                        <Label
                          key={themeName}
                          className="[&:has([data-state=checked])>div]:border-primary"
                        >
                          <RadioGroupItem
                            value={themeValues.id}
                            className="sr-only"
                          />

                          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <PageThemePreview themeValues={themeValues} />
                          </div>
                          <span className="block w-full p-2 text-center font-medium">
                            {themeName}
                          </span>
                        </Label>
                      );
                    }
                  )}
                </RadioGroup>
              </div>
            </div>

            <DialogFooter>
              {onCancel && (
                <Button type="button" variant="secondary" onClick={onCancel}>
                  ← Cancel
                </Button>
              )}
              <Button type="submit">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Page
              </Button>
            </DialogFooter>
          </Form>
        );
      }}
    </Formik>
  );
}
