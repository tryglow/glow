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

type FormType = { data: Formdata[] }

interface Formdata {
    id: string;
    pageId: string;
    email: string;
    text: string;
    blockType: string;
    option: {
        text: string;
        color: string;
    },
    createdAt: string;
    updatedAt: string;
} 

const EmailsData = ({ data }: FormType) => {
  return (
    <div className='border border-gray-400 rounded shadow-md p-4 mx-2'>
      <h1 className='font-semibold mb-2'>Email Waitlist</h1>
      {data?.map((form: Formdata) => <div className='ml-3' key={form?.id}>{form?.email}</div>)}
    </div>
  )
}
const TextsData = ({ data }: FormType) => {
  return(
    <div className='border border-gray-400 rounded shadow-md p-4 mx-2'>
      <h1 className='font-semibold mb-2'>Text Submissions</h1>
      {data?.map((form: Formdata) => <div className='ml-3' key={form?.id}>{form?.text}</div>)}
  </div>
  )
}
const OptionsData = ({ data }: FormType) => {
  return (
    <div className='border border-gray-400 rounded shadow-md p-4 mx-2'>
      <h1 className='font-semibold mb-2'>Choices</h1>
      {data?.map((form: Formdata) => <div className='ml-3' key={form?.id}>{form?.option?.text}</div>)}   
    </div>
  )
}


export function SidebarForms({ pageId }: Props) {
  const { data: emailFormData, isLoading, mutate } = useSWR<Formdata[]>(
    `/api/feedback/get-data?pageId=${pageId}&type=waitlist-email`
  );
  const { data: textFormData, isLoading: loadingTexts, mutate: mutateTexts } = useSWR<Formdata[]>(
    `/api/feedback/get-data?pageId=${pageId}&type=text-form`
  );
  const { data: optionFormData, isLoading: loadingOptions, mutate: mutateOptions } = useSWR<Formdata[]>(
    `/api/feedback/get-data?pageId=${pageId}&type=selection-form`
  );

  const emailList = useMemo(() => emailFormData || [], [emailFormData])
  const textsList = useMemo(() => textFormData || [], [textFormData])
  const optionsList = useMemo(() => optionFormData || [], [optionFormData])

  const reloadForm = () => {
    mutate()
    mutateTexts() 
    mutateOptions()
  }
  
  return (
    <>
      <SidebarContentHeader title="Forms">
        <Icon icon="solar:refresh-bold-duotone" width="20" height="20" className={`${isLoading && 'animate-spin'} cursor-pointer`} onClick={reloadForm} />
      </SidebarContentHeader>
      {isLoading && <div className='flex justify-center item-center my-2 gap-2'>
        <span className='animate-bounce text-xl font-bold'>.</span>
        <span className='animate-bounce delay-100 text-xl font-bold'>.</span>
        <span className='animate-bounce delay-200 text-xl font-bold'>.</span>
      </div> }
      
      {emailList || textsList || optionsList ? 
        <div className='flex flex-col gap-3 mt-3'>
          <EmailsData data={emailList} />
          <TextsData data={textsList} />
          <OptionsData data={optionsList} />
        </div> 
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
