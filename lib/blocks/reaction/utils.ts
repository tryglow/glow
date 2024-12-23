import { mutate } from "swr";
import { toast } from '@/components/ui/use-toast';
import { captureException } from '@sentry/nextjs';

export const handlReactions = async (values: any, blockId: string, contentStyles: any) => {
  console.log('values for react block count => ', values);
  
  try {
    const req = await fetch(`/api/blocks/${blockId}/update-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newData: values,
        contentStyles
      }),
    });

    if (req.ok) {
      mutate(values);
      toast({
        title: 'Saved!',
        description: 'Your changes have been saved.',
      });
      // setContentStyles({})
    }
  } catch (error) {
    captureException(error);
  }
};

export const icons = [
  {
    title: 'Globe',
    icon: 'lucide:globe'
  },
  {
    title: 'Heart',
    icon: 'solar:heart-bold'
  },
  {
    title: 'Like',
    icon: 'solar:like-bold'
  },
  {
    title: 'Diamond',
    icon: 'material-symbols-light:diamond-rounded'
  },
  {
    title: 'Pen',
    icon: 'solar:pen-2-bold'
  },
  {
    title: 'Human',
    icon: 'si:user-fill'
  },
  {
    title: 'Screen',
    icon: 'teenyicons:screen-solid'
  },
  {
    title: 'Smile',
    icon: 'raphael:smile'
  },
]

export const colors = ["#F4393C", "#FF4182", "#3293FB", "#20D800", "#FA5DFF", "#F9E552", "#FF7E38", "#24FBFF"]