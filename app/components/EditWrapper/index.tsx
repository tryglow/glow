'use client';

import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import {
  ReactNode,
  useCallback,
  useEffect,
  useOptimistic,
  useTransition,
} from 'react';
import { Layout, Layouts, ResponsiveProps } from 'react-grid-layout';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';

import { PageConfig, ResponsiveReactGridLayout } from '@/app/[slug]/grid';

import { debounce } from '@/lib/utils';

import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

import { useEditModeContext } from '../../contexts/Edit';
import { CoreBlock } from '../CoreBlock';

// Dynamically import BlockSheet
const DynamicBlockSheet = dynamic(
  () => import('../BlockSheet').then((mod) => mod.BlockSheet),
  { ssr: false }
);

interface Props {
  children: ReactNode[];
  layoutProps: ResponsiveProps;
}

export function EditWrapper({ children, layoutProps }: Props) {
  const { draggingItem } = useEditModeContext();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { data: layout, mutate: mutateLayout } = useSWR<PageConfig>(
    `/api/pages/${params.slug}/layout`
  );

  const [isPending, startTransition] = useTransition();

  const [optimisticItems, setOptimisticItems] =
    useOptimistic<ReactNode[]>(children);

  useEffect(() => {
    if (!optimisticItems) return;

    const filteredItems = (optimisticItems as ReactNode[])?.filter(
      (item: any) => {
        return layout?.sm?.some((layoutItem) => layoutItem.i === item.key);
      }
    );

    startTransition(() => {
      setOptimisticItems(filteredItems);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  const onDrop = async (
    newLayout: Layout[],
    layoutItem: any,
    _event: Event
  ) => {
    // Get the last item from the newLayout
    const lastItem = layoutItem;

    const newItemId = uuidv4();

    const newItemConfig = {
      h: draggingItem.h,
      i: newItemId,
      w: draggingItem.w,
      x: lastItem.x,
      y: lastItem.y,
    };

    startTransition(async () => {
      setOptimisticItems([
        ...optimisticItems,
        <div key={newItemId} data-grid={newItemConfig} className="w-full h-14">
          <CoreBlock
            blockId={newItemId}
            blockType="default"
            pageId="tmp-unknown"
            isEditable={false}
          >
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
          </CoreBlock>
        </div>,
      ]);

      await fetch('/api/page/blocks/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          block: {
            id: newItemId,
            type: draggingItem.type,
          },
          pageSlug: params.slug,
        }),
      });

      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      router.refresh();
    });
  };

  const handleLayoutChange = async (
    newLayout: Layout[],
    currentLayouts: Layouts
  ) => {
    if (newLayout.length === 0 || !layout) {
      return;
    }

    /**
     * We don't support editing on smaller breakpoints yet, so we can skip saving
     * the layout if the user is on a smaller breakpoint. This also fixes an issue
     * where the large layout is overwritten if the user resizes their window
     * whilst in edit mode.
     */

    if (window.innerWidth <= 505) {
      return;
    }

    /**
     * handleLayoutChange is called quite often, so we need to make sure that
     * the layout has actually changed before we send a request to the server.
     *
     * I have a feeling that this might cause some issues in the future, but
     * for now it works.
     */
    const sortAndNormalizeLayout = (layout: Layout[]) => {
      return layout
        .sort((a, b) => a.i.localeCompare(b.i))
        .map((obj) =>
          Object.keys(obj)
            .sort()
            .reduce((result: Layout, key: string) => {
              // @ts-ignore
              result[key] = obj[key];
              return result;
            }, {} as Layout)
        );
    };

    const sortedNewLayout = JSON.stringify(sortAndNormalizeLayout(newLayout));
    const sortedLayout = JSON.stringify(sortAndNormalizeLayout(layout.sm));

    // Both layouts are the same, so we can skip the request
    if (sortedNewLayout === sortedLayout) {
      return;
    }

    const checkIfLayoutContainsTmpBlocks = newLayout.find(
      (block) => block.i === 'tmp-block'
    );

    if (checkIfLayoutContainsTmpBlocks) {
      return;
    }

    try {
      const req = await fetch('/api/page/config/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageSlug: params.slug,
          newLayout: newLayout,
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

      toast({
        title: 'Layout saved',
      });

      mutateLayout({
        xss: currentLayouts.xss,
        sm: newLayout,
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: 'error',
        title: 'Something went wrong',
        description: "We couldn't update your page layout",
      });
    }
  };

  const editableLayoutProps: ResponsiveProps = {
    ...layoutProps,
    onDrop,
    onLayoutChange: handleLayoutChange,
    droppingItem: draggingItem,
    draggableCancel: '.noDrag',
    useCSSTransforms: true,
    compactType: undefined,
  };

  return (
    <>
      <ResponsiveReactGridLayout
        {...editableLayoutProps}
        layouts={{
          lg: layout?.sm ?? [],
          md: layout?.sm ?? [],
          sm: layout?.sm ?? [],
          xs: layout?.sm ?? [],
          xxs: layout?.xss ?? [],
        }}
      >
        {optimisticItems}
      </ResponsiveReactGridLayout>
      <DynamicBlockSheet />
    </>
  );
}
