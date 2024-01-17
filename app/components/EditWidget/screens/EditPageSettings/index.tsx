'use client'
import { EditPageSettingsForm } from '@/app/components/EditPageSettings'
import { EditWidgetHeader } from '../..'

import { useEffect, useState } from 'react'
import { fetchPageSettings } from './action'
import { useParams } from 'next/navigation'
import { Page } from '@prisma/client'

interface Props {
  onBack: () => void
}

export function EditPageSettings({ onBack }: Props) {
  const [pageSettings, setPageSettings] = useState<Partial<Page> | null>(null)
  const params = useParams()

  useEffect(() => {
    const getPageSettings = async () => {
      const data = await fetchPageSettings(params.slug as string)

      setPageSettings(data?.page ?? null)
    }

    getPageSettings()
  }, [params.slug])

  return (
    <>
      <EditWidgetHeader
        title="Page Settings"
        label="Customise the title and description of your page."
      />
      <EditPageSettingsForm
        onBack={onBack}
        initialValues={{
          metaTitle: pageSettings?.metaTitle ?? '',
          pageSlug: pageSettings?.slug ?? '',
          published: pageSettings?.publishedAt ? true : false,
        }}
      />
    </>
  )
}
