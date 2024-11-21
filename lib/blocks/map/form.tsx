import { useLoadScript } from '@react-google-maps/api';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { Loader2 } from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { FormField } from '@/app/components/FormField';
import { captureException } from '@sentry/nextjs';
import { EditFormProps } from '../types';
import { MapBlockConfig, mapThemes } from './config';

declare global {
  namespace google.maps.places {
    interface QueryAutocompletePrediction {
      description: string;
    }
  }
}

export function EditForm({
  initialValues,
  onSave,
  onClose,
}: EditFormProps<MapBlockConfig>) {
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
        mapTheme: initialValues?.mapTheme,
      }}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ values, isSubmitting, errors }) => (
        <Form className="w-full flex flex-col gap-2">
          <GoogleMapsAutoCompleteInput />

          <div className="mt-4">
            <FormField
              fieldType="select"
              label="Map theme"
              name="mapTheme"
              id="mapTheme"
              error={errors.mapTheme}
            >
              {Object.entries(mapThemes).map(([key, { label }]) => {
                return (
                  <option value={key} key={key}>
                    {label}
                  </option>
                );
              })}
            </FormField>
          </div>

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
  );
}

const GoogleMapsAutoCompleteInput = () => {
  const { submitForm, setFieldValue } = useFormikContext();
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [predictions, setPredictions] = useState<
    google.maps.places.QueryAutocompletePrediction[]
  >([]);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

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

          try {
            await setFieldValue('coords', coords);
          } catch (error) {
            captureException(error);
          } finally {
            setTimeout(async () => {
              await submitForm();
            }, 100);
          }

          setOpen(false);
        } else {
          console.error(
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
        onChangeCapture={(e: ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
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
};
