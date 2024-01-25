import useSWR from 'swr';

import { editForms } from '@/lib/blocks/edit';
import { Blocks } from '@/lib/blocks/types';
import { fetcher } from '@/lib/fetch';

import { toast } from '@/components/ui/use-toast';

interface Props {
  onClose: () => void;
  blockId: string;
  blockType: Blocks;
}

export function EditForm({ onClose, blockId, blockType }: Props) {
  const { data: initialValues, mutate } = useSWR(
    `/api/blocks/${blockId}`,
    fetcher
  );

  const onSave = async (values: any) => {
    try {
      const req = await fetch(`/api/blocks/${blockId}/update-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newData: values,
        }),
      });

      if (req.ok) {
        mutate(values);
        toast({
          title: 'Saved!',
          description: 'Your changes have been saved.',
        });
      }
    } catch (error) {
      console.log(
        'There was an error updating the page config for the edit form',
        error
      );
    }
  };

  const CurrentEditForm = editForms[blockType];

  return (
    <div className="max-h-[600px] overflow-y-auto">
      <CurrentEditForm
        initialValues={initialValues}
        onSave={onSave}
        onClose={onClose}
        blockId={blockId}
      />
    </div>
  );
}
