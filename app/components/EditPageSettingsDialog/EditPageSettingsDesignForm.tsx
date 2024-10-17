'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { defaultThemes } from '@/lib/theme';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

import { FormField } from '../FormField';
import { FormFileUpload } from '../FormFileUpload';
import { updateDesignPageSettings } from './actions';
import { designPageSettingsSchema } from './shared';

export type FormValues = {
  themeId: string;
  backgroundImage: string;
};

interface Props {
  onCancel: () => void;
  initialValues: FormValues;
  pageId: string;
}

export function EditPageSettingsDesign({
  onCancel,
  initialValues,
  pageId,
}: Props) {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, setFieldError }: FormikHelpers<FormValues>
  ) => {
    setSubmitting(true);

    try {
      const response = await updateDesignPageSettings(
        values,
        params.slug as string
      );

      if (response?.error) {
        console.log(response.error);
        toast({
          variant: 'error',
          title: 'Something went wrong',
          description: response.error.message,
        });
      }

      toast({
        title: 'Your page settings have been updated',
      });
      router.refresh();
      onCancel();
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
        themeId: initialValues.themeId,
        backgroundImage: initialValues.backgroundImage,
      }}
      validate={withZodSchema(designPageSettingsSchema)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, values, setFieldValue, errors }) => (
        <Form className="w-full flex flex-col">
          <div className="border-b border-white/10 pb-12">
            <div className="mt-4">
              <FormField
                fieldType="select"
                label="Page theme"
                name="themeId"
                placeholder=""
                id="themeId"
                error={errors.themeId}
              >
                {defaultThemes.map((theme) => {
                  return (
                    <option value={theme.id} key={theme.id}>
                      {theme.name}
                    </option>
                  );
                })}
              </FormField>
            </div>

            <div className="mt-4">
              <FormFileUpload
                htmlFor="page-background-image"
                onUploaded={(url) => setFieldValue('backgroundImage', url)}
                initialValue={initialValues?.backgroundImage}
                referenceId={pageId}
                label="Background image"
                assetContext="pageBackgroundImage"
                isCondensed
              />
            </div>
          </div>

          <DialogFooter>
            {onCancel && (
              <Button variant="secondary" onClick={onCancel}>
                ← Cancel
              </Button>
            )}
            <Button type="submit">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Settings
            </Button>
          </DialogFooter>
        </Form>
      )}
    </Formik>
  );
}
