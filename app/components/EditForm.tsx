import useSWR from 'swr';

import { editForms } from '@/lib/blocks/edit';
import { Blocks } from '@/lib/blocks/types';

import { toast } from '@/components/ui/use-toast';
import { captureException } from '@sentry/nextjs';
import { useEditModeContext } from '../contexts/Edit';

interface Props {
  onClose: () => void;
  blockId: string;
  blockType: Blocks;
}

export function EditForm({ onClose, blockId, blockType }: Props) {
  const { data, mutate } = useSWR(`/api/blocks/${blockId}`);
  const { data: initialValues } = data
  const { contentStyles, setContentStyles } = useEditModeContext();

  const onSave = async (values: any) => {
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

  const CurrentEditForm = editForms[blockType];

  return (
    <div className="max-h-[calc(100vh_-_90px)] overflow-y-auto">
      <CurrentEditForm
        initialValues={initialValues}
        onSave={onSave}
        onClose={onClose}
        blockId={blockId}
      />
    </div>
  );
}
