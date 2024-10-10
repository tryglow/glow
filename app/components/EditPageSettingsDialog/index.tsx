'use client';

import { Page } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { fetchPageSettings } from './actions';
import { EditPageSettingsDesign } from './design-settings-form';
import { EditPageSettingsGeneral } from './general-settings-form';

interface Props {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose: () => void;
}

export function EditPageSettingsDialog({ open, onOpenChange, onClose }: Props) {
  const [pageSettings, setPageSettings] = useState<Partial<Page> | null>(null);
  const params = useParams();

  useEffect(() => {
    if (!params.slug) return;

    const getPageSettings = async () => {
      const data = await fetchPageSettings(params.slug as string);

      setPageSettings(data?.page ?? null);
    };

    getPageSettings();
  }, [params.slug]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Page settings</DialogTitle>
          <DialogDescription>
            Changes to your page settings will be reflected on your live page.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="general" className="w-1/2">
              General
            </TabsTrigger>
            <TabsTrigger value="design" className="w-1/2">
              Design
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <EditPageSettingsGeneral
              onCancel={onClose}
              initialValues={{
                metaTitle: pageSettings?.metaTitle ?? '',
                pageSlug: pageSettings?.slug ?? '',
                published: pageSettings?.publishedAt ? true : false,
              }}
              pageId={pageSettings?.id ?? ''}
            />
          </TabsContent>
          <TabsContent value="design">
            <EditPageSettingsDesign
              onCancel={onClose}
              initialValues={{
                themeId: pageSettings?.themeId ?? '',
                backgroundImage: pageSettings?.backgroundImage ?? '',
              }}
              pageId={pageSettings?.id ?? ''}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
