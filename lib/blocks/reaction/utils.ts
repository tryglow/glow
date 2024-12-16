import { mutate } from "swr";
import { toast } from '@/components/ui/use-toast';
import { captureException } from '@sentry/nextjs';

export const handlReactions = async (values: any, blockId: string, contentStyles: any) => {
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