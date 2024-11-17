import useSWR from 'swr';

import { editForms } from '@/lib/blocks/edit';
import { Blocks } from '@/lib/blocks/types';

import { toast } from '@/components/ui/use-toast';
import { captureException } from '@sentry/nextjs';

interface Props {
  onClose: () => void;
  blockId: string;
  blockType: Blocks;
}

export function EditForm({ onClose, blockId, blockType }: Props) {
  const { data: blockData, mutate } = useSWR(`/api/blocks/${blockId}`);

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
        mutate(values, {
          optimisticData: values,
        });
        toast({
          title: 'Saved!',
          description: 'Your changes have been saved.',
        });
      }
    } catch (error) {
      captureException(error);
    }
  };

  const CurrentEditForm = editForms[blockType];

  return (
    <div className="max-h-[calc(100vh_-_90px)] overflow-y-auto">
      <CurrentEditForm
        initialValues={blockData.blockData}
        onSave={onSave}
        onClose={onClose}
        blockId={blockId}
        integration={blockData.integration}
      />
    </div>
  );
}
