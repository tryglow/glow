import {
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
  useFormikContext,
} from 'formik';

import { useEffect, useRef, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { MapBlockConfig } from './config';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

declare global {
  namespace google.maps.places {
    interface QueryAutocompletePrediction {
      description: string;
    }
  }
}

interface Props {
  initialValues: MapBlockConfig;
  onSave: (values: MapBlockConfig) => void;
  formRef: {
    current: FormikProps<MapBlockConfig> | null;
  };
}

export function EditForm({ initialValues, onSave, formRef }: Props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: ['places'],
  });

  const handleSubmit = async (
    values: MapBlockConfig,
    { setSubmitting }: FormikHelpers<MapBlockConfig>
  ) => {
    setSubmitting(true);
    onSave(values);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <Formik
      initialValues={{
        coords: initialValues?.coords,
      }}
      onSubmit={handleSubmit}
      enableReinitialize={true}
      innerRef={formRef}
    >
      {() => (
        <Form className="w-full flex flex-col gap-2">
          <GoogleMapsAutoCompleteInput />
        </Form>
      )}
    </Formik>
  );
}

const GoogleMapsAutoCompleteInput = () => {
  const { submitForm, setFieldValue, values } = useFormikContext();
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [predictions, setPredictions] = useState<
    google.maps.places.QueryAutocompletePrediction[]
  >([]);
  const geocoder = useRef<google.maps.Geocoder>();

  useEffect(() => {
    if (!window.google) {
      console.error('Google Maps API not loaded');
      return;
    }

    geocoder.current = new google.maps.Geocoder();

    const service = new google.maps.places.AutocompleteService();

    const displaySuggestions = (
      predictions: google.maps.places.QueryAutocompletePrediction[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) => {
      if (
        status !== google.maps.places.PlacesServiceStatus.OK ||
        !predictions
      ) {
        alert(status);
        return;
      }
      setPredictions(predictions);
    };

    if (input) {
      service.getQueryPredictions({ input }, displaySuggestions);
    }
  }, [input]);

  const handleSelect = (address: string) => {
    if (!geocoder.current) return;

    geocoder.current.geocode(
      { address: address },
      async function (results, status) {
        if (status === 'OK' && results) {
          const firstResult = results[0].geometry;
          const coords = {
            lat: firstResult.location.lat(),
            long: firstResult.location.lng(),
          };

          setFieldValue('coords', coords);

          await submitForm();
        } else {
          alert(
            'Geocode was not successful for the following reason: ' + status
          );
        }
      }
    );
  };

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        className="border-0"
        onChangeCapture={(e) => setInput(e.target.value)}
      />

      <CommandList>
        <CommandEmpty>Search for a place</CommandEmpty>
        <CommandGroup>
          {predictions.map((prediction) => (
            <CommandItem
              key={prediction.description}
              value={prediction.description}
              onSelect={(currentValue) => {
                handleSelect(prediction.description);
                setOpen(false);
              }}
            >
              {prediction.description}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search places..."
      />
      <ul>
        {predictions.map((prediction, index) => (
          <li key={index} onClick={() => handleSelect(prediction.description)}>
            {prediction.description}
          </li>
        ))}
      </ul>
    </div>
  );
};
