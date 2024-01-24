import * as Yup from 'yup';

export interface MapBlockConfig {
  coords: {
    long: number;
    lat: number;
  };
}

export const defaults: MapBlockConfig = {
  coords: {
    long: 103.8591065,
    lat: 1.2837575,
  },
};

export const MapSchema = Yup.object().shape({
  coords: Yup.object().shape({
    long: Yup.number().required('Please provide a longitude'),
    lat: Yup.number().required('Please provide a latitude'),
  }),
});
