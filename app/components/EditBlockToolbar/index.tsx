'use client';

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Layout } from 'react-grid-layout';
import useSWR from 'swr';

import { Blocks } from '@/lib/blocks/types';
import { fetcher } from '@/lib/fetch';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';

import { config } from '../DraggableBlockButton';
import { EditForm } from '../EditForm';

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
  const { mutate } = useSWR(`/api/blocks/${blockId}`, fetcher);
  const { data: layout, mutate: mutateLayout } = useSWR<Layout[]>(
    `/api/pages/${slug}/layout`,
    fetcher
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
        const newLayout = layout.filter((item) => {
          return item.i !== blockId;
        });

        mutateLayout(newLayout);
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
      <span className="isolate inline-flex rounded-full shadow-md z-40 absolute top-2 right-2 opacity-0 block-toolbar">
        <button
          type="button"
          className="relative inline-flex items-center rounded-l-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-stone-100 focus:z-10"
          onClick={() => setOpen(true)}
        >
          <PencilSquareIcon width={16} height={16} className="text-slate-700" />
        </button>
        <button
          type="button"
          className="relative -ml-px inline-flex items-center rounded-r-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-stone-100 focus:z-10"
          onClick={() => handleDeleteBlock(blockId)}
        >
          <TrashIcon width={16} height={16} className="text-slate-700" />
        </button>
      </span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="noDrag">
          <SheetHeader className="border-b border-stone-200 pb-2 mb-4">
            <SheetTitle>Editing {config[blockType].title}</SheetTitle>
          </SheetHeader>
          <SheetDescription>
            <EditForm
              onClose={() => setOpen(false)}
              blockId={blockId}
              blockType={blockType}
            />
          </SheetDescription>
        </SheetContent>
      </Sheet>
    </>
  );
}
