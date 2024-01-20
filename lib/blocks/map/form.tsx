import {
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
  useFormikContext,
} from 'formik';

import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { useLoadScript } from '@react-google-maps/api';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

declare global {
  namespace google.maps.places {
    interface QueryAutocompletePrediction {
      description: string;
    }
  }
}

type FormValues = {
  coords: string;
};

interface Props {
  initialValues: FormValues;
  onSave: (values: FormValues) => void;
  formRef: {
    current: FormikProps<FormValues> | null;
  };
}

export function EditForm({ initialValues, onSave, formRef }: Props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: ['places'],
  });

  console.log('Is Loaded', isLoaded);

  const handleChange = (ev) => {
    console.log('Handle Change', ev);
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
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
          <GoogleMapsAutoCompleteInput onNewLocation={handleChange} />
        </Form>
      )}
    </Formik>
  );
}

const GoogleMapsAutoCompleteInput = ({
  onNewLocation,
}: {
  onNewLocation: (coords: any) => void;
}) => {
  const { submitForm, setFieldValue } = useFormikContext();
  const [input, setInput] = useState('');
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
