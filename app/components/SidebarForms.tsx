import {
  SidebarContentHeader,
  SidebarGroup,
  SidebarGroupContent,
} from '@/app/components/ui/sidebar';
import useSWR from 'swr';

import { useMemo } from 'react';
import { WaitlistFormConfig } from '@/lib/blocks/waitlist-email/config';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Icon } from "@iconify/react";

type Props = {
  pageId: string
}

export function SidebarForms({ pageId }: Props) {
  const { data: emailListData, isLoading, mutate } = useSWR<WaitlistFormConfig[]>(
    `/api/feedback/get-data?pageId=${pageId}`
  );

  const emailList: WaitlistFormConfig[] = useMemo(() => emailListData || [], [emailListData])
  
  return (
    <>
      <SidebarContentHeader title="Forms">
        <Icon icon="solar:refresh-bold-duotone" width="20" height="20" className={`${isLoading && 'animate-spin'} cursor-pointer`} onClick={() => mutate()} />
      </SidebarContentHeader>
      {isLoading && <div className='flex justify-center item-center my-2 gap-2'>
        <span className='animate-bounce text-xl font-bold'>.</span>
        <span className='animate-bounce delay-100 text-xl font-bold'>.</span>
        <span className='animate-bounce delay-200 text-xl font-bold'>.</span>
      </div> }
      
      {emailList.length > 0 ? <Accordion type="single" collapsible className="w-full">
      {emailList.map((data: any, index ) =>  
        <div key={data?.pageId + index}>
          <AccordionItem key={data?.pageId + index} value={data?.id}>
            <AccordionTrigger className="font-medium px-3">
              {data?.email}
            </AccordionTrigger>
            <AccordionContent className="bg-white font-bold text-black/60 p-3 text-sm">

            {!data?.text && !data?.option?.text ? <span className=' text-gray-300'>Empty Message</span> : 
              <>
                {data?.text ?
                <div>Message: <span className='font-medium text-sm'>{data?.text}</span></div>
                : <span className='text-gray-300'>Message not available.</span>}
                
                {data?.option?.text ? <div>
                  Option: <span style={{color: data?.option?.color }} className='font-medium text-sm'> {data?.option?.text}</span>
                </div> : <span className='text-gray-300'>Option not available.</span> }

              </>
              }

            </AccordionContent>
          </AccordionItem>
          
        </div> 
        )}
        </Accordion>
        :
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="w-full aspect-square bg-stone-200 rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground text-sm text-center px-8 text-pretty">
                Build forms to collect data from your users! Send an email to
                team@glow.as to request access
              </span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      }
    </>
  );
}
