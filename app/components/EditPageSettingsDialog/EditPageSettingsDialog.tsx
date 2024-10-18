'use client';

import { Page } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { EditPageSettingsDesign } from './EditPageSettingsDesignForm';
import { EditPageSettingsGeneral } from './EditPageSettingsGeneralForm';
import { fetchPageSettings } from './actions';

interface Props {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose: () => void;
}

export function EditPageSettingsDialog({ open, onOpenChange, onClose }: Props) {
  const [pageSettings, setPageSettings] = useState<Partial<Page> | null>(null);
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open && params.slug) {
      startTransition(async () => {
        const [data] = await Promise.all([
          fetchPageSettings(params.slug as string),
        ]);

        setPageSettings(data?.page ?? null);
      });
    }
  }, [open, params.slug]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Page settings</DialogTitle>
          <DialogDescription>
            Changes to your page settings will be reflected on your live page.
          </DialogDescription>
        </DialogHeader>

        {isPending ? (
          <div className="flex items-center justify-center aspect-square rounded-mg bg-stone-100">
            Loading...
          </div>
        ) : (
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
        )}
      </DialogContent>
    </Dialog>
  );
}
