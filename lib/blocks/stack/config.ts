import * as Yup from 'yup';

export interface StackBlockConfig {
  title: string;
  label: string;
  items: {
    title: string;
    label: string;
    icon: {
      src: string;
    };
  }[];
}

export const defaults: StackBlockConfig = {
  title: 'Stack',
  label: 'Some cool tools',
  items: [
    {
      title: 'Figma',
      label: 'Design',
      icon: {
        src: 'https://cdn.glow.as/default-data/figma.jpeg',
      },
    },
    {
      title: 'Amie',
      label: 'Productivity',
      icon: {
        src: 'https://cdn.glow.as/default-data/amie.jpg',
      },
    },
    {
      title: 'Warp',
      label: 'Engineering',
      icon: {
        src: 'https://cdn.glow.as/default-data/warp.png',
      },
    },
  ],
};

export const StackSchema = Yup.object().shape({
  title: Yup.string().required('Please provide a title'),
  label: Yup.string().required('Please provide a label'),
  items: Yup.array()
    .min(1, 'Please add atleast one item')
    .of(
      Yup.object().shape({
        title: Yup.string().required('Please provide a title'),
        label: Yup.string().required('Please provide a label'),
        icon: Yup.object().shape({
          src: Yup.string().required('Please provide an icon URL'),
        }),
      })
    ),
});
