import * as Yup from 'yup';

export interface LinkBoxBlockConfig {
  title: string;
  label: string;
  icon: {
    src: string;
  };
  link: string;
}

export const defaults: LinkBoxBlockConfig = {
  icon: {
    src: 'https://cdn.glow.as/default-data/x-logo.png',
  },
  link: 'https://x.com/tryglow',
  title: 'X',
  label: 'Follow us on X',
};

export const LinkBoxSchema = Yup.object().shape({
  title: Yup.string().required('Please provide a title'),
  label: Yup.string(),
  link: Yup.string().required('Please provide a link'),
  icon: Yup.object().shape({
    src: Yup.string().required('Please provide an icon'),
  }),
});
