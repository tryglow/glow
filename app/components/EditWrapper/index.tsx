'use client'

import { useEditModeContext } from '../../contexts/Edit'
import { v4 as uuidv4 } from 'uuid'
import { ReactNode, useOptimistic, useTransition } from 'react'
import ReactGridLayout, {
  Layout,
  ReactGridLayoutProps,
} from 'react-grid-layout'
import { useParams, useRouter } from 'next/navigation'
import { CoreBlock } from '../CoreBlock'
import { EditWidget } from '../EditWidget'
import toast from 'react-hot-toast'

interface Props {
  layout: Layout[]
  children: ReactNode
  layoutProps: ReactGridLayoutProps
}

export function EditWrapper({ layout, children, layoutProps }: Props) {
  const { draggingItem, setLayout } = useEditModeContext()
  const router = useRouter()
  const params = useParams()
  const [isPending, startTransition] = useTransition()
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    children,
    // @ts-ignore
    (state, newItem) => [...state, newItem]
  )

  const onDrop = async (
    newLayout: Layout[],
    layoutItem: Layout,
    _event: Event
  ) => {
    // Get the last item from the newLayout
    const lastItem = newLayout[newLayout.length - 1]

    const newItemId = uuidv4()

    const newItemConfig = {
      h: draggingItem.h,
      i: newItemId,
      w: draggingItem.w,
      x: lastItem.x,
      y: lastItem.y,
    }

    startTransition(async () => {
      addOptimisticItem(
        <div key={newItemId} data-grid={newItemConfig} className="w-full h-14">
          <CoreBlock>Loading...</CoreBlock>
        </div>
      )

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
      })

      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      router.refresh()
    })
  }

  const handleLayoutChange = async (newLayout: Layout[]) => {
    setLayout(newLayout)

    const checkIfLayoutContainsTmpBlocks = newLayout.find(
      (block) => block.i === 'tmp-block'
    )

    if (checkIfLayoutContainsTmpBlocks) {
      return
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
      })

      const res = await req.json()

      if (res.error) {
        toast.error(res.error.message)
        return
      }
    } catch (error) {
      console.log(error)
      toast.error("Couldn't update page layout")
    }
  }

  const editableLayoutProps: ReactGridLayoutProps = {
    ...layoutProps,
    onDrop,
    onLayoutChange: handleLayoutChange,
    onDropDragOver: (event: Event) => {
      return draggingItem
    },
  }

  return (
    <>
      <ReactGridLayout layout={layout} {...editableLayoutProps}>
        {optimisticItems}
      </ReactGridLayout>
      <EditWidget />
    </>
  )
}
