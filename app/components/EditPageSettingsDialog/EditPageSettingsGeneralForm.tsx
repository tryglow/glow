'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { deletePage } from '@/app/api/page/actions';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

import { FormField } from '../FormField';
import { updateGeneralPageSettings } from './actions';
import { generalPageSettingsSchema } from './shared';

export type FormValues = {
  pageSlug: string;
  metaTitle: string;
  published: boolean;
};

interface Props {
  initialValues: FormValues;
  pageId: string;
}

export function EditPageSettingsGeneral({ initialValues, pageId }: Props) {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, setFieldError }: FormikHelpers<FormValues>
  ) => {
    setSubmitting(true);

    try {
      const response = await updateGeneralPageSettings(
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

        if (response.error.field) {
          setFieldError(response.error.field, response.error.message);
        }
        return;
      }

      if (response.data) {
        if (values.pageSlug !== params.slug) {
          router.push(`/${values.pageSlug}`);
        }
      }

      toast({
        title: 'Your page settings have been updated',
      });
      router.refresh();
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

  const handleDeletePage = async () => {
    try {
      const res = await deletePage(params.slug as string);

      if (res?.error) {
        toast({
          variant: 'error',
          title: 'Something went wrong',
          description: res.error,
        });
        return;
      }

      toast({
        title: 'Your page has been deleted',
      });

      router.push('/');
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Something went wrong',
        description: 'Sorry, there was an issue deleting your page',
      });
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          pageSlug: initialValues.pageSlug,
          metaTitle: initialValues.metaTitle,
          published: initialValues.published,
        }}
        validate={withZodSchema(generalPageSettingsSchema)}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue, errors }) => (
          <Form className="w-full flex flex-col">
            <div className="border-b border-white/10 pb-12">
              <div>
                <FormField
                  withPrefix="glow.as/"
                  label="Slug"
                  name="pageSlug"
                  placeholder="your-page"
                  id="pageSlug"
                  error={errors.pageSlug}
                />
                <div className="hidden px-3 py-4 rounded-lg ring-1 ring-black/10 relative bg-[#fffbec] flex flex-col gap-1">
                  <span className="text-sm text-black font-semibold">
                    Custom Domain 👀
                  </span>
                  <span className="text-sm text-black">
                    Add a custom domain to your page for a one-time fee of{' '}
                    <del>$10</del> <ins className="font-semibold">$5</ins>. This
                    feature is still in beta, and you can enable it by reaching
                    out to us at <a href="mailto:team@glow.as">team@glow.as</a>.
                  </span>
                </div>
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
                <Label htmlFor="published">Published</Label>
                <div className="flex flex-col md:flex-row items-center mt-3">
                  <Switch
                    id="published"
                    checked={values.published}
                    onCheckedChange={(newVal) =>
                      setFieldValue('published', newVal)
                    }
                  />
                  <label className="text-sm mt-3 md:mt-0 md:ml-3 max-w-80">
                    Disabling this will turn your page into a draft and only you
                    will be able to see it.
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="published">Delete your page</Label>
                <span className="text-sm mt-1 block">
                  Deleting your page is irreversible and your page username will
                  be available to use by other users.
                </span>
                <div className="flex flex-col items-start mt-3 bg-red-100 p-2 rounded-lg">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowConfirmDelete(true)}
                  >
                    Delete Page
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
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

      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm delete</DialogTitle>
            <DialogDescription>
              Deleting your page is irreversible and your page username will be
              available to use by other users. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePage}>
              Delete Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
