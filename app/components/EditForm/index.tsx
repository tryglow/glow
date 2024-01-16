import {useEditModeContext} from '@/app/contexts/Edit';
import {editForms} from '@/lib/blocks/edit';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

export function EditForm() {
  const [initialValues, setInitialValues] = useState<any>();

  const {selectedSectionId} = useEditModeContext();
  const router = useRouter();

  if (!selectedSectionId) return null;

  useEffect(() => {
    if (!selectedSectionId) return;

    const fetchInitialValues = async () => {
      try {
        const req = await fetch(
          `/api/page/sections/get-data?sectionId=${selectedSectionId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await req.json();

        if (data.data) {
          setInitialValues(data.data.section);
        }
      } catch (error) {
        console.log(
          'There was an error fetching the page config for the edit form',
          error
        );
      }
    };

    fetchInitialValues();
  }, [selectedSectionId]);

  const onSave = async (values: any) => {
    try {
      const req = await fetch('/api/page/sections/update-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionId: selectedSectionId,
          newData: values,
        }),
      });

      if (req.ok) {
        router.refresh();
      }
    } catch (error) {
      console.log(
        'There was an error updating the page config for the edit form',
        error
      );
    }
  };

  const CurrentEditForm = editForms['content'];

  return (
    <>
      <span className="font-bold font-md">
        Editing <span className="font-mono text-xs">{selectedSectionId}</span>
      </span>
      <CurrentEditForm initialValues={initialValues} onSave={onSave} />
    </>
  );
}
