import { EditFormProps } from '../types';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { FormField } from '@/components/FormField';
import { FormFileUpload } from '@/components/FormFileUpload';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/fetch';
import { HeaderBlockConfig, HeaderSchema } from '@tryglow/blocks';
import { Page } from '@tryglow/prisma';
import { Form, Formik, FormikHelpers } from 'formik';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

export function EditForm({
  initialValues,
  onSave,
  onClose,
  blockId,
}: EditFormProps<HeaderBlockConfig>) {
  const params = useParams();

  const { data: pageSettings } = useSWR<Partial<Page>>(
    `/api/pages/${params.slug}/settings`,
    fetcher
  );

  const onSubmit = async (
    values: HeaderBlockConfig,
    { setSubmitting }: FormikHelpers<HeaderBlockConfig>
  ) => {
    setSubmitting(true);
    onSave(values);
  };

  return (
    <Formik
      initialValues={{
        title: initialValues?.title ?? '',
        description: initialValues?.description ?? '',
        avatar: {
          src: initialValues?.avatar?.src ?? '',
        },
        showVerifiedBadge: initialValues?.showVerifiedBadge ?? false,
        verifiedPageTitle: initialValues?.verifiedPageTitle ?? '',
      }}
      validationSchema={HeaderSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting, setFieldValue, errors, values }) => (
        <Form className="w-full flex flex-col gap-2">
          {values.showVerifiedBadge ? (
            <FormField
              label="Title"
              name="verifiedPageTitle"
              id="verifiedPageTitle"
              error={errors.verifiedPageTitle}
              disabled
            />
          ) : (
            <FormField
              label="Title"
              name="title"
              id="title"
              error={errors.title}
            />
          )}

          {pageSettings?.verifiedAt && (
            <div className="flex items-start space-x-2 my-4">
              <Checkbox
                onCheckedChange={(checked) =>
                  setFieldValue('showVerifiedBadge', checked)
                }
                id="showVerifiedBadge"
                name="showVerifiedBadge"
                checked={values.showVerifiedBadge}
              />
              <div className="flex flex-col gap-1">
                <Label htmlFor="showVerifiedBadge">Show verified badge</Label>
                <span className="text-sm text-stone-500">
                  Your page has been verified by Glow. You can choose to show
                  the verification badge, however the header title will only
                  show the verified page name.
                </span>
              </div>
            </div>
          )}

          <FormField
            label="Subtitle"
            name="description"
            id="description"
            error={errors.description}
            isTextArea
            fieldType="textarea"
          />

          <FormFileUpload
            htmlFor="header-avatar"
            onUploaded={(url) => setFieldValue('avatar.src', url)}
            initialValue={initialValues?.avatar?.src}
            referenceId={blockId}
            assetContext="blockAsset"
          />

          <div className="flex flex-shrink-0 justify-between py-4 border-t border-stone-200">
            <Button type="button" variant="secondary" onClick={onClose}>
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
