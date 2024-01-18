'use client'
import { useEffect, useState } from 'react'

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useEditModeContext } from '@/app/contexts/Edit'
import { DraggableBlockButton, config } from '../DraggableBlockButton'
import { useParams } from 'next/navigation'
import { EditForm } from '../EditForm'
import { Button } from '../Button'
import { EditPageSettings } from './screens/EditPageSettings'

export function EditWidget() {
  const [open, setOpen] = useState(true)

  const [visibleSection, setVisibleSection] = useState<
    'settings' | 'blocks' | 'drag'
  >('drag')

  const params = useParams()

  const { layout, setSelectedBlock, selectedBlock } = useEditModeContext()

  useEffect(() => {
    if (selectedBlock?.id) {
      setVisibleSection('blocks')
    }
  }, [selectedBlock])

  const onSaveLayout = async () => {
    const newLayout = layout.map((item) => {
      return {
        w: item.w,
        h: item.h,
        x: item.x,
        y: item.y,
        i: item.i,
      }
    })

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

      const data = await req.json()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="z-40 relative">
      <div className="w-96 max-h-[calc(100%_-_40px)] fixed top-5 right-5 flex rounded-2xl bg-white shadow-xl overflow-hidden border border-stone-200">
        <div className="flex w-full h-full flex-col divide-y divide-gray-200">
          <div className="h-0 flex-1 overscroll-contain">
            {visibleSection === 'settings' && (
              <>
                <EditPageSettings onBack={() => setVisibleSection('drag')} />
              </>
            )}

            {visibleSection === 'drag' && (
              <>
                <EditWidgetHeader
                  title="Blocks"
                  label="Drag and drop blocks to build your page, or click on a block to edit it."
                />
                <div className="overflow-y-auto h-auto max-h-[600px] bg-stone-50">
                  <div className="px-4 sm:px-6 pb-5 pt-6">
                    <div className="space-y-3 flex flex-col">
                      <DraggableBlockButton type="header" />
                      <DraggableBlockButton type="content" />
                      <DraggableBlockButton type="stack" />
                      <DraggableBlockButton type="image" />
                      <DraggableBlockButton type="github-commits-this-month" />
                      <DraggableBlockButton type="spotify-playing-now" />
                      <DraggableBlockButton type="twitter-latest-tweet" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-shrink-0 justify-between px-4 py-4 border-t border-stone-200">
                  <Button
                    label="Page Settings"
                    variant="secondary"
                    onClick={() => setVisibleSection('settings')}
                    icon={
                      <Cog6ToothIcon
                        width={20}
                        height={20}
                        className="text-slate-700"
                      />
                    }
                  />
                </div>
              </>
            )}

            {visibleSection === 'blocks' && selectedBlock && (
              <>
                <EditWidgetHeader
                  title={`Editing ${config[selectedBlock.type].title}`}
                  label={selectedBlock.id}
                />

                {selectedBlock.id && (
                  <EditForm onBack={() => setVisibleSection('drag')} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const EditWidgetHeader = ({
  title,
  label,
}: {
  title: string
  label: string
}) => {
  return (
    <div className="bg-white border-b border-stone-200 px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold leading-6 text-stone-900">
          {title}
        </h2>
      </div>
      <div className="mt-1">
        <p className="text-sm text-stone-700">{label}</p>
      </div>
    </div>
  )
}
