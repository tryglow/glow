'use client'

import { useEditModeContext } from '@/app/contexts/Edit'
import { Blocks } from '@/lib/blocks/types'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Props {
  blockId: string
  blockType: Blocks
}

export function EditBlockToolbar({ blockId, blockType }: Props) {
  const { setSelectedBlock } = useEditModeContext()

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
      })

      const res = await req.json()

      if (res.error) {
        toast.error(res.error.message)
        return
      }

      toast.success('Block deleted')
    } catch (error) {
      console.log(error)
      toast.error("Couldn't delete block")
    }
  }
  return (
    <span className="isolate inline-flex rounded-md shadow-sm z-40 absolute -top-10 opacity-0 block-toolbar">
      <button
        type="button"
        className="relative inline-flex items-center rounded-l-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-stone-100 focus:z-10"
        onClick={() => setSelectedBlock({ id: blockId, type: blockType })}
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
  )
}
