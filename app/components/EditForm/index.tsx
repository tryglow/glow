import { useEditModeContext } from '@/app/contexts/Edit'
import { Button } from '@/components/ui/button'
import { editForms } from '@/lib/blocks/edit'
import { FormikProps } from 'formik'
import { Loader2 } from 'lucide-react'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface Props {
  onBack: () => void
}

export function EditForm({ onBack }: Props) {
  const [initialValues, setInitialValues] = useState<any>()

  const { selectedBlock } = useEditModeContext()
  const router = useRouter()

  const formRef = useRef<FormikProps<any>>(null)

  useEffect(() => {
    if (!selectedBlock?.id) return

    const fetchInitialValues = async () => {
      try {
        const req = await fetch(
          `/api/page/blocks/get-data?blockId=${selectedBlock.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        const data = await req.json()

        if (data.data) {
          setInitialValues(data.data.block)
        }
      } catch (error) {
        console.log(
          'There was an error fetching the page config for the edit form',
          error
        )
      }
    }

    fetchInitialValues()
  }, [selectedBlock])

  if (!selectedBlock) return null

  const onSave = async (values: any) => {
    try {
      const req = await fetch('/api/page/blocks/update-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockId: selectedBlock.id,
          newData: values,
        }),
      })

      if (req.ok) {
        router.refresh()
      }
    } catch (error) {
      console.log(
        'There was an error updating the page config for the edit form',
        error
      )
    }
  }

  const CurrentEditForm = editForms[selectedBlock.type]

  return (
    <>
      <div className="overflow-y-auto h-auto max-h-[600px] bg-stone-50">
        <div className="px-4 sm:px-6 pb-5 pt-6">
          <CurrentEditForm
            initialValues={initialValues}
            onSave={onSave}
            formRef={formRef}
          />
        </div>
      </div>

      <div className="flex flex-shrink-0 justify-between px-4 py-4 border-t border-stone-200">
        <Button variant="secondary" onClick={onBack}>
          ← Cancel
        </Button>
        <Button type="button" onClick={() => formRef?.current?.handleSubmit()}>
          {formRef?.current?.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save
        </Button>
      </div>
    </>
  )
}
