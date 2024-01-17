'use client';

import {EditModeContextProvider, useEditModeContext} from '../../contexts/Edit';
import {v4 as uuidv4} from 'uuid';
import {ReactNode, useEffect, useOptimistic, useTransition} from 'react';
import ReactGridLayout, {Layout, ReactGridLayoutProps} from 'react-grid-layout';
import {useParams, useRouter} from 'next/navigation';
import {CoreBlock} from '../CoreBlock';
import {EditWidget} from '../EditWidget';

interface Props {
  layout: Layout[];
  children: ReactNode;
  layoutProps: ReactGridLayoutProps;
}

export function EditWrapper({layout, children, layoutProps}: Props) {
  const {draggingItem, setLayout} = useEditModeContext();
  const router = useRouter();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    children,
    // @ts-ignore
    (state, newItem) => [...state, newItem]
  );

  const onDrop = async (
    newLayout: Layout[],
    layoutItem: Layout,
    _event: Event
  ) => {
    // Get the last item from the newLayout
    const lastItem = newLayout[newLayout.length - 1];

    const newItemId = uuidv4();

    const newItemConfig = {
      h: draggingItem.h,
      i: newItemId,
      w: draggingItem.w,
      x: lastItem.x,
      y: lastItem.y,
    };

    startTransition(async () => {
      addOptimisticItem(
        <div key={newItemId} data-grid={newItemConfig} className="w-full h-14">
          <CoreBlock>Loading...</CoreBlock>
        </div>
      );

      const req = await fetch('/api/page/sections/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: {
            id: newItemId,
            type: draggingItem.type,
          },
          layout: [...layout, newItemConfig],
          pageSlug: params.slug,
        }),
      });

      handleLayoutChange(newLayout);

      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      router.refresh();
    });
  };

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  };

  const editableLayoutProps: ReactGridLayoutProps = {
    ...layoutProps,
    onDrop,
    onLayoutChange: handleLayoutChange,
    onDropDragOver: (event: Event) => {
      return draggingItem;
    },
  };

  useEffect(() => {
    // Function to handle click event
    const handleItemClick = (event) => {
      event.preventDefault();
      console.log(event);
      const gridItemId = event.target.getAttribute('data-grid-section-id');
      console.log('Grid item clicked:', gridItemId);
    };

    // Attaching click event listener to each grid item
    document.querySelectorAll('[data-grid-section-id]').forEach((item) => {
      item.addEventListener('click', handleItemClick);
    });

    // Clean up function
    return () => {
      document.querySelectorAll('[data-grid-section-id]').forEach((item) => {
        item.removeEventListener('click', handleItemClick);
      });
    };
  }, []);

  return (
    <>
      <ReactGridLayout layout={layout} {...editableLayoutProps}>
        {optimisticItems}
      </ReactGridLayout>
      <EditWidget />
    </>
  );
}
