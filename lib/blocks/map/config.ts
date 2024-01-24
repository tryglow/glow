import * as Yup from 'yup';

export interface MapBlockConfig {
  coords: {
    long: number;
    lat: number;
  };
}

export const defaults: MapBlockConfig = {
  coords: {
    long: -0.2985,
    lat: 51.7732,
  },
};

export const MapSchema = Yup.object().shape({
  coords: Yup.object().shape({
    long: Yup.number().required('Please provide a longitude'),
    lat: Yup.number().required('Please provide a latitude'),
  }),
});
