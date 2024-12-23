import { EditFormProps } from '../types';
import { colors, icons } from './utils';
import { Form, Formik, FormikHelpers } from 'formik';
import { Loader2 } from 'lucide-react';
import { Icon } from "@iconify/react";
import { Button } from '@/components/ui/button';
import { ReactionBlockConfig, reactionBlockSchema } from './config';
import { useEditModeContext } from '@/app/contexts/Edit';
import { useEffect, useState } from 'react';

export function EditForm({
  initialValues,
  onSave,
  onClose,
  blockId
}: EditFormProps<any>) {
  console.log('initialValues of reaction block => ', initialValues);
  const [reactionText, setReactionText] = useState('')
    const { contentStyles, setContentStyles } = useEditModeContext()
    useEffect(() => {
      setContentStyles({
        reactions: initialValues?.reactions,
        showLove: initialValues?.showLove,
        text: initialValues?.text || 'Love',
        icon: initialValues?.icon || icons[1],
        color: initialValues?.color || colors[1],
        blockId
      })
      setReactionText(initialValues?.text || 'Love')
    }, [])  

    useEffect(() => {
      console.log('contentStyles for reaction => ', contentStyles);
      
      setReactionText(contentStyles?.text)
    }, [contentStyles])
  
  const onSubmit: any = async (
    values: ReactionBlockConfig,
    { setSubmitting }: FormikHelpers<ReactionBlockConfig>
  ) => {
    // const data = {
    //   reactions: contentStyles?.reactions,
    //   showLove: true,
    //   text: contentStyles?.text,
    //   icon: contentStyles?.icon
    // }
    setSubmitting(true);
    onSave(contentStyles);
  };

  const handleChange = (name: any, value: string) => {
    name === 'text' && setReactionText(value)
    setContentStyles((prev: any) => ({...prev, [name]: value }))
  }
  
  return (
    <div>
      <div className="bg-stone-100 rounded-md flex flex-col items-center text-center px-4 py-8">
        <span className="font-medium text-lg text-stone-800 mt-3">Reactions</span>
        <span className="font-normal text-stone-600 mt-1">
          Reactions are a fun way to engage with your audience. More coming soon!
        </span>
      </div>

      <div className='bg-gray-200 rounded-2xl p-5'>
        <p className='mb-3 text-base'>Select Icon</p>
        <div className='grid grid-cols-4 gap-2'>
          {icons?.map((icon: any) => <div key={icon?.title} onClick={() => handleChange('icon', icon)} className={`h-11 w-11 flex justify-center items-center rounded-md ${icon?.title.toLowerCase() === contentStyles?.icon?.title.toLowerCase() && 'border-2 border-black'} `}>
          <Icon icon={icon?.icon} width="32" height="32" />
          </div>)}
        </div>

        <p className='my-3 text-base'>Select Color</p>
        <div className='grid grid-cols-4 gap-4 w-60'>
          {colors?.map((color: string) => <div key={color} style={{background: color, boxShadow: color === contentStyles?.color ? '0 0 0 3px white, 0 0 0 4px black' : ''}} onClick={() => handleChange('color', color)} className={`h-10 w-10 rounded-md`}></div>)}
        </div>

        <Formik
        initialValues={{
          text: contentStyles?.text || "" ,
        }}
        validationSchema={reactionBlockSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, errors }: any) => (
          <Form className="w-full flex flex-col gap-2 mt-5">
            <label htmlFor="textfield" className='text-base'>Text</label>
            <div className='relative'>
              <input name='text' type="text" id='text' maxLength={8} className='w-full rounded-md border-0 px-3 py-2 ring-inset focus:ring-black text-sm' value={reactionText} onChange={(e) => handleChange('text', e.target.value)} />

              <p className='absolute top-2.5 right-3 text-xs text-gray-400'>
                {reactionText?.length}/8
              </p>
            </div>
            {errors?.text && <p className='text-red-500'>{errors?.text}</p> }

            <div className="flex flex-shrink-0 justify-between py-4 border-t border-stone-200">
              <Button variant="secondary" onClick={onClose}>
                ← Cancel
              </Button>
              <Button type="submit">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </div>
          </Form>
        )}

      </Formik>
      </div>
    </div>
  );
}
