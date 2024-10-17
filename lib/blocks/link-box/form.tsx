import { Form, Formik, FormikHelpers } from 'formik';
import { Loader2 } from 'lucide-react';

import { FormField } from '@/components/FormField';
import { FormFileUpload } from '@/components/FormFileUpload';
import { IconSelect } from '@/components/IconSelect';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { EditFormProps } from '../types';
import { LinkBoxBlockConfig, LinkBoxSchema } from './config';

export function EditForm({
  initialValues,
  onSave,
  onClose,
  blockId,
}: EditFormProps<LinkBoxBlockConfig>) {
  const onSubmit = async (
    values: LinkBoxBlockConfig,
    { setSubmitting }: FormikHelpers<LinkBoxBlockConfig>
  ) => {
    setSubmitting(true);
    onSave(values);
  };

  return (
    <Formik
      initialValues={{
        link: initialValues?.link,
        title: initialValues?.title,
        label: initialValues?.label,
        icon: {
          src: initialValues?.icon?.src,
        },
      }}
      validationSchema={LinkBoxSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting, setFieldValue, errors, values }) => {
        const initialUploadedIcon = !initialValues?.icon?.src.startsWith(
          'https://cdn.glow.as/default-data'
        )
          ? initialValues?.icon?.src
          : undefined;

        const initialTab = values?.icon?.src?.startsWith(
          'https://cdn.glow.as/default-data'
        )
          ? 'iconGallery'
          : 'uploadCustom';

        return (
          <Form className="w-full flex flex-col gap-1">
            <FormField
              label="Title"
              name="title"
              id="title"
              error={errors.title}
            />

            <FormField
              label="Label"
              name="label"
              id="label"
              error={errors.label}
            />
            <FormField label="Link" name="link" id="link" error={errors.link} />
            <Label className="mb-1 mt-3">Select an icon</Label>

            <Tabs defaultValue={initialTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger className="w-1/2" value="iconGallery">
                  Icon Gallery
                </TabsTrigger>
                <TabsTrigger className="w-1/2" value="uploadCustom">
                  Upload
                </TabsTrigger>
              </TabsList>
              <TabsContent value="iconGallery">
                <IconSelect
                  initialValue={initialValues?.icon?.src}
                  onIconChange={(iconSrc) => setFieldValue('icon.src', iconSrc)}
                />
              </TabsContent>
              <TabsContent value="uploadCustom">
                <FormFileUpload
                  htmlFor="link-box-icon"
                  onUploaded={(url) => setFieldValue('icon.src', url)}
                  initialValue={initialUploadedIcon}
                  referenceId={blockId}
                  label="Upload your own icon"
                  assetContext="blockAsset"
                />
              </TabsContent>
            </Tabs>

            {errors.icon?.src && (
              <p className="mt-2 text-sm text-red-600" id={`icon-src-error`}>
                {errors.icon?.src}
              </p>
            )}
            <div className="flex flex-shrink-0 justify-between py-4 border-t border-stone-200">
              <Button variant="secondary" onClick={onClose}>
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
        );
      }}
    </Formik>
  );
}
