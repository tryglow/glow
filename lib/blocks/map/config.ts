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
