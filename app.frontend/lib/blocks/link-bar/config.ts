import * as Yup from 'yup';

export interface LinkBarBlockConfig {
  links: {
    link: string;
    icon: {
      src: string;
    };
  }[];
}

export const defaults: LinkBarBlockConfig = {
  links: [
    {
      link: 'https://x.com/tryglow',
      icon: { src: 'https://cdn.glow.as/default-data/icons/twitter.svg' },
    },
  ],
};

export const LinkBarSchema = Yup.object().shape({
  links: Yup.array()
    .min(1, 'Please add at least one link')
    .of(
      Yup.object().shape({
        link: Yup.string()
          .required('Please provide a link')
          .url('Please provide a valid URL'),
        icon: Yup.object().shape({
          src: Yup.string().required('Please provide an icon'),
        }),
      })
    ),
});
