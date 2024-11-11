'use client'

import React, { FunctionComponent } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { BlockProps } from '../ui'
import { CoreBlock } from '@/app/components/CoreBlock'
import { AccordionBlockConfig } from './config'
import useSWR from 'swr'

export const AccordionUI:FunctionComponent<BlockProps> = (props) => {
  
  const { data } = useSWR<AccordionBlockConfig>(`/api/blocks/${props.blockId}`);

  return (
    <CoreBlock {...props} isFrameless>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className='text-2xl font-medium text-sys-label-primary'>{data?.accTitle}</AccordionTrigger>
          <AccordionContent className='text-lg text-sys-label-secondary'>
            {data?.accContent}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CoreBlock>
  )
}