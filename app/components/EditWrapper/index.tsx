'use client';

import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import {
  ReactNode,
  useEffect,
  useMemo,
  useOptimistic,
  useTransition,
} from 'react';
import {
  Layout,
  Layouts,
  Responsive,
  ResponsiveProps,
  WidthProvider,
} from 'react-grid-layout';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';

import { PageConfig } from '@/app/[domain]/[slug]/grid';

import { cn } from '@/lib/utils';

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
  const { draggingItem, editLayoutMode, nextToAddBlock, setNextToAddBlock } =
    useEditModeContext();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { data: layout, mutate: mutateLayout } = useSWR<PageConfig>(
    `/api/pages/${params.slug}/layout`
  );

  const [isPending, startTransition] = useTransition();

  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvider(Responsive),
    []
  );

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

  useEffect(() => {
    console.log('nextToAddBlock', nextToAddBlock);
    if (nextToAddBlock) {
      handleAddNewBlock([], nextToAddBlock, null, true);
    }
  }, [nextToAddBlock]);

  const handleAddNewBlock = async (
    newLayout: Layout[],
    layoutItem: any,
    _event: Event | null,
    isMobile?: boolean
  ) => {
    // Get the last item from the newLayout
    const lastItem = layoutItem;

    const newItemId = uuidv4();

    const newItemConfig: Layout = {
      h: isMobile ? layoutItem.h : draggingItem.h,
      i: newItemId,
      w: isMobile ? layoutItem.w : draggingItem.w,
      x: isMobile ? 0 : lastItem.x,
      y: isMobile ? Infinity : lastItem.y,
      minW: 4,
      minH: 2,
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
            type: isMobile ? layoutItem.type : draggingItem.type,
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

    // if (window.innerWidth <= 505) {
    //   return;
    // }

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
    const sortedLayout = JSON.stringify(
      sortAndNormalizeLayout(
        editLayoutMode === 'mobile' ? layout.xxs : layout.sm
      )
    );

    // Both layouts are the same, so we can skip the request
    if (sortedNewLayout === sortedLayout) {
      return;
    }

    if (newLayout.some((block) => block.i === 'tmp-block')) {
      return;
    }

    const nextLayout = {
      xxs: editLayoutMode === 'mobile' ? newLayout : layout.xxs,
      sm: editLayoutMode === 'desktop' ? newLayout : layout.sm,
    };

    if (newLayout.length !== (layout.xxs.length || layout.sm.length)) {
      // find element that is different
      const difference = newLayout.filter((item) => {
        if (editLayoutMode === 'mobile') {
          return !layout.xxs.some((item2) => item2.i === item.i);
        }
        return !layout.sm.some((item2) => item2.i === item.i);
      });

      if (difference.length === 1) {
        if (editLayoutMode === 'mobile') {
          nextLayout.sm.push(difference[0]);
        }
        if (editLayoutMode === 'desktop') {
          nextLayout.xxs.push(difference[0]);
        }
      }
    }

    try {
      const req = await fetch('/api/page/config/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageSlug: params.slug,
          newLayout: nextLayout,
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

      mutateLayout(nextLayout);
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
    onDrop: handleAddNewBlock,
    onLayoutChange: handleLayoutChange,
    droppingItem: draggingItem,
    draggableCancel: '.noDrag',
    useCSSTransforms: true,
    resizeHandles: ['se'],
  };

  return (
    <>
      <div
        className={cn(
          'min-h-screen bg-black/0 transition-colors hover:bg-black/5 w-full mx-auto pb-24 md:pb-0',
          editLayoutMode === 'mobile' ? 'max-w-[400px]' : 'max-w-[768px]'
        )}
      >
        <ResponsiveReactGridLayout
          {...editableLayoutProps}
          className="!overflow-auto"
          layouts={{
            lg: layout?.sm ?? [],
            md: layout?.sm ?? [],
            sm: layout?.sm ?? [],
            xs: layout?.sm ?? [],
            xxs: layout?.xxs ?? [],
          }}
        >
          {optimisticItems}
        </ResponsiveReactGridLayout>
      </div>
      <DynamicBlockSheet />
    </>
  );
}
