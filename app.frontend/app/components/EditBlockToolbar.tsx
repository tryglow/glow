'use client';

import { PageConfig } from '@/app/[domain]/[slug]/grid';
import { useSidebar } from '@/app/components/ui/sidebar';
import { useEditModeContext } from '@/app/contexts/Edit';
import { useToast } from '@/components/ui/use-toast';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { captureException } from '@sentry/nextjs';
import { Blocks } from '@tryglow/blocks';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';

interface Props {
  blockId: string;
  blockType: Blocks;
}

export function EditBlockToolbar({ blockId, blockType }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const { setOpen, setOpenMobile, setSidebarView } = useSidebar();

  const { setCurrentEditingBlock } = useEditModeContext();

  const { mutate } = useSWR(`/api/blocks/${blockId}`);
  const { data: layout, mutate: mutateLayout } = useSWR<PageConfig>(
    `/api/pages/${slug}/layout`
  );

  const handleDeleteBlock = async (blockId: string, blockType: Blocks) => {
    if (blockType === 'header') {
      toast({
        variant: 'error',
        title: 'You cannot delete the header block',
      });
      return;
    }

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
      captureException(error);
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
            setOpenMobile(true);
            setSidebarView('blockForm');
            setCurrentEditingBlock({ id: blockId, type: blockType });
          }}
          onClick={() => {
            setOpen(true);
            setOpenMobile(true);
            setSidebarView('blockForm');
            setCurrentEditingBlock({ id: blockId, type: blockType });
          }}
        >
          <PencilSquareIcon width={16} height={16} className="text-slate-700" />
        </button>
        <button
          type="button"
          className="relative -ml-px inline-flex items-center rounded-r-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-stone-100 focus:z-10"
          disabled={blockType === 'header'}
          onClick={() => handleDeleteBlock(blockId, blockType)}
          onTouchStart={() => handleDeleteBlock(blockId, blockType)}
        >
          <TrashIcon width={16} height={16} className="text-slate-700" />
        </button>
      </span>
    </>
  );
}
