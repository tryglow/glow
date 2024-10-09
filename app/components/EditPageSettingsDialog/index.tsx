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

import { fetchPageSettings } from './action';
import { EditPageSettings } from './form';

interface Props {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose: () => void;
}

export function EditPageSettingsDialog({ open, onOpenChange, onClose }: Props) {
  const [pageSettings, setPageSettings] = useState<Partial<Page> | null>(null);
  const params = useParams();

  console.log('edit Page Is Open', open);

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

        <EditPageSettings
          onCancel={onClose}
          initialValues={{
            metaTitle: pageSettings?.metaTitle ?? '',
            pageSlug: pageSettings?.slug ?? '',
            published: pageSettings?.publishedAt ? true : false,
            themeId: pageSettings?.themeId ?? '',
            backgroundImage: pageSettings?.backgroundImage ?? '',
          }}
          pageId={pageSettings?.id ?? ''}
        />
      </DialogContent>
    </Dialog>
  );
}
