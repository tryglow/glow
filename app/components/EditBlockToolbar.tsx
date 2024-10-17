'use client';

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';

import { PageConfig } from '@/app/[domain]/[slug]/grid';

import { Blocks } from '@/lib/blocks/types';

import { config } from '@/components/DraggableBlockButton';
import { EditForm } from '@/components/EditForm';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';

interface Props {
  blockId: string;
  blockType: Blocks;
}

export function EditBlockToolbar({ blockId, blockType }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;

  const [open, setOpen] = useState(false);
  const { mutate } = useSWR(`/api/blocks/${blockId}`);
  const { data: layout, mutate: mutateLayout } = useSWR<PageConfig>(
    `/api/pages/${slug}/layout`
  );

  const handleDeleteBlock = async (blockId: string) => {
    try {
      const req = await fetch('/api/page/blocks/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockId,
        }),
      });

      const res = await req.json();

      if (res.error) {
        toast({
          variant: 'error',
          title: 'Something went wrong',
          description: res.error.message,
        });
        return;
      }

      mutate();

      if (layout) {
        const newSmLayout = layout.sm.filter((item) => {
          return item.i !== blockId;
        });
        const newXxsLayout = layout.xxs.filter((item) => {
          return item.i !== blockId;
        });

        mutateLayout({
          xxs: newXxsLayout,
          sm: newSmLayout,
        });
      }

      router.refresh();

      toast({
        title: 'Block deleted',
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: 'error',
        title: "We couldn't delete the block",
      });
    }
  };
  return (
    <>
      <span className="isolate inline-flex rounded-full shadow-md z-40 absolute top-2 right-2 block-toolbar">
        <button
          type="button"
          className="relative inline-flex items-center rounded-l-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-stone-100 focus:z-10"
          onTouchStart={() => {
            setOpen(true);
          }}
          onClick={() => {
            setOpen(true);
          }}
        >
          <PencilSquareIcon width={16} height={16} className="text-slate-700" />
        </button>
        <button
          type="button"
          className="relative -ml-px inline-flex items-center rounded-r-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-stone-100 focus:z-10"
          onClick={() => handleDeleteBlock(blockId)}
          onTouchStart={() => handleDeleteBlock(blockId)}
        >
          <TrashIcon width={16} height={16} className="text-slate-700" />
        </button>
      </span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="noDrag">
          <SheetHeader className="border-b border-stone-200 pb-2 mb-4">
            <SheetTitle>Editing {config[blockType].title}</SheetTitle>
          </SheetHeader>

          <EditForm
            onClose={() => setOpen(false)}
            blockId={blockId}
            blockType={blockType}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
