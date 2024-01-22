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
  label: 'My apps & tools',
  items: [
    {
      title: 'Notion',
      label: 'Productivity',
      icon: {
        src: '/demo/notion.jpeg',
      },
    },
    {
      title: 'Vercel',
      label: 'Engineering',
      icon: {
        src: '/demo/vercel.jpeg',
      },
    },
    {
      title: 'Figma',
      label: 'Design',
      icon: {
        src: '/demo/figma.jpeg',
      },
    },
  ],
};

export const StackSchema = Yup.object().shape({
  title: Yup.string().required('Please provide a title'),
  label: Yup.string().required('Please provide a label'),
  avatar: Yup.string().required('Please provide an avatar URL'),
  items: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Please provide a title'),
      label: Yup.string().required('Please provide a label'),
      icon: Yup.object().shape({
        src: Yup.string().required('Please provide an icon URL'),
      }),
    })
  ),
});
