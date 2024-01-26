'use client';

import { useParams, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useOptimistic, useTransition } from 'react';
import ReactGridLayout, {
  Layout,
  ReactGridLayoutProps,
} from 'react-grid-layout';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';

import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

import { useEditModeContext } from '../../contexts/Edit';
import { BlockSheet } from '../BlockSheet';
import { CoreBlock } from '../CoreBlock';

interface Props {
  layout: Layout[];
  children: ReactNode[];
  layoutProps: ReactGridLayoutProps;
}

export function EditWrapper({ children, layoutProps }: Props) {
  const { draggingItem, setLayout } = useEditModeContext();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { data: layout, mutate: mutateLayout } = useSWR<Layout[]>(
    `/api/pages/${params.slug}/layout`
  );

  const [isPending, startTransition] = useTransition();

  const [optimisticItems, setOptimisticItems] =
    useOptimistic<ReactNode[]>(children);

  useEffect(() => {
    if (!optimisticItems) return;

    const filteredItems = (optimisticItems as ReactNode[])?.filter(
      (item: any) => {
        return layout?.some((layoutItem) => layoutItem.i === item.key);
      }
    );

    startTransition(() => {
      setOptimisticItems(filteredItems);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  const onDrop = async (
    newLayout: Layout[],
    layoutItem: Layout,
    _event: Event
  ) => {
    // Get the last item from the newLayout
    const lastItem = newLayout[newLayout.length - 1];
    // setLayout(newLayout);

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

  const handleLayoutChange = async (newLayout: Layout[]) => {
    if (newLayout.length === 0 || !layout) {
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
    const sortedLayout = JSON.stringify(sortAndNormalizeLayout(layout));

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

      mutateLayout(newLayout);
    } catch (error) {
      console.log(error);
      toast({
        variant: 'error',
        title: 'Something went wrong',
        description: "We couldn't update your page layout",
      });
    }
  };

  const editableLayoutProps: ReactGridLayoutProps = {
    ...layoutProps,
    onDrop,
    onLayoutChange: handleLayoutChange,
    onDropDragOver: (event: Event) => {
      return draggingItem;
    },

    draggableCancel: '.noDrag',
    useCSSTransforms: true,
    compactType: undefined,
  };

  return (
    <>
      <ReactGridLayout layout={layout} {...editableLayoutProps}>
        {optimisticItems}
      </ReactGridLayout>
      <BlockSheet />
    </>
  );
}
