import * as Yup from 'yup';

export interface HeaderBlockConfig {
  title: string;
  description: string;
  avatar: {
    src: string;
  };
}

export const defaults: HeaderBlockConfig = {
  avatar: {
    src: '/demo/avatar.svg',
  },
  title: 'Alex Pate',
  description: 'A generic header component to display a title',
};

export const HeaderSchema = Yup.object().shape({
  title: Yup.string().required('Please provide a title'),
  description: Yup.string().required('Please provide a subtitle'),
  avatar: Yup.string().required('Please provide an avatar URL'),
});
